# Cypress end-to-end tests

Cypress is a modern end-2-end test runner that uses an embedded Electron shell (embedding & preconfiguring Chrome) to make test running easy and straightforward. That circumventes a lot of issues people have been encountering with Selenium based test setups.

### Useful links

* [Cypress official website](https://cypress.io/)
* [Cypress docs](https://docs.cypress.io/guides/overview/why-cypress.html)

## File Organization

Cypress resides inside a dedicated `e2e` folder at the root of the monorepo, having its own `package.json`. Therefore it is **necessary to run `yarn install`** inside the `e2e` folder. The reasoning behind this is due to [name clashes](https://twitter.com/juristr/status/1022378988537298945) between Mocha (required by Cypress) and Jasmine (used by Angular). There are [various ways to work around this issue](https://github.com/basarat/typescript-book/blob/master/docs/testing/cypress.md), one is to have a dedicated e2e folder (which is the strategy taken here).

Cypress has a well-defined file structure that is automatically created when 1st opening the Cypress test runner.

```
<cypress>
  |--<fixtures>         // you can specify custom JSON fixtures to be used in HTTP calls made by Cypress.
  |--<integration>      // folder where the Cypress tests are being placed.
    |--<smartfed-web>   // integration tests for `smartfed-web`
  |--<plugins>          // allows to extend Cypress' behavior. In this monorepo, Cypress has been extended using Webpack to precompile the TypeScript tests. [More here](https://docs.cypress.io/guides/tooling/typescript-support.html#).
  |--<support>          // allows to specify [custom Cypress commands](https://docs.cypress.io/api/cypress-api/custom-commands.html#Syntax)
cypress.json            // used to [configure cypress](https://docs.cypress.io/guides/references/configuration.html#Options)
```

## Configuring test runs

The `config` folder contains a `smartfed-web.dev.json` which is used to configure the Cypress test run. The configuration file is passed in the Cypress run command (see `package.json`):

```
{
  ...
  "scripts": {
    "cypress:run:smartfed-web": "cypress run --env project=smartfed-web",
    "cypress:open:smartfed-web": "cypress open --env project=smartfed-web"
  },
  ...
}
```

Additional configuration params that shouldn't end up stored on Git, like usernames and passwords, can be passed as environment variables. For instance:

```
$ export CYPRESS_username=admin@maier.com
$ export CYPRESS_password=somepassword
```

## Running tests

To run the tests, make sure you're inside the `e2e` folder.

In order to execute the tests with the Cypress UI, execute

```
$ yarn cypress:open:smartfed-web
```

Instead if you wanna execute them in headless mode, use

```
$ yarn cypress:run:smartfed-web
```

## Writing tests

> Check out the "useful links" section below and read through the guides, especially the "Do's and Don'ts" section

### Test Structure

In general, independently of which test framework you choose, it is good practice to structure your test according to the **three A's**: Arrange, Act, Assert. This greatly helps in keeping tests readable and "do/test just one thing".

Every test has a phase where you **arrange things**, where you prepare your test scenario. This can already take place in the `beforeEach(...)` or directly in each single test case. Then you **act**, you do the actual thing you want to test, like executing that method call or clicking that button. Of course it can be a series of actions. Finally you **assert** whether the outcome is correct. Over time you will naturally structure your tests according to these sections. Initially when starting it is suggested to keep comments in the tests as a point of orientation:

```javascript
it('should do something useful', () => {
  // arrange
  /* do your test setup here which is specific to this test case */

  // act
  /* click the button, execute a method call... */

  // assert
  /* check whether the outcome matches your expectations */
});
```

### Selecting elements

Cypress specifically uses jQuery selectors under the hood for grabbing instances of DOM elements. As such you can simply use CSS selectors to target some element and execute actions on it accordingly.

```javascript
it('some test', () => {
  cy.get('my-component > ul > .action-buttons')
    .first()
    .click();
  ...
})
```

**Watch out** however, that these selectors tend to be the points that break in UI tests. If you change your DOM structure, these may not match the desired elements any more and thus result in **fleaky tests**.

Therefore choose your selectors "wisely".

#### Strategy: use `data-*` attributes

One recommended approach is to use `data-*` selectors which are supported HTML5 attributes to attach data to HTML elements. We can use them as a hook point for our tests.

```html
...
<div class="some-class">
  ...
  <button class="btn btn-primary-action">Save</button>
</div>
```

Assume you have some button that is nested within some deep DOM structure. Rather than using the class (i.e. `.some-class > .btn-primary-action`) which has a high probability to change, we can add a `data-tuid` (`tuid` is completely up to us to define) attribute:

```html
...
<div class="some-class">
  ...
  <button class="btn btn-primary-action" data-tuid="btn-person-save">Save</button>
</div>
```

As a result, in our Cypress test we can get a reference to the button as follows:

```javascript
it('some test', () => {
  cy.get('[data-tuid="btn-person-save"]').click();
});
```

#### Strategy: use native form submit()

When you have to trigger a form, don't grab a reference to the submit button for then triggering a `click` event on it. Simply grab the form and use the native `submit` event.

```javascript
it('some test', () => {
  // trigger submit on form
  cy.get('[data-tuid="person-form"]')
    .submit();
});
```

#### Don't authenticate through the login screen

Unless you're testing the login screen, don't use it in every single test to authenticated. Rather use `cy.request(...)` to execute an HTTP request that does the login in the `beforeEach(...)`.

There's already a Cypress command set up for `smartfed-web` to do so:

```javascript
describe('some test suite', () => {
  beforeEach(() => {
    cy.silentlogin();
  });

  it('some test', () => {
    // just do your test logic, the
    // authentication is already set up
  });
})
```

#### Try to avoid `cy.wait(SOMENUMBER)`

Waiting slows down tests, makes them flaky and should thus be avoided when possible.

Every `cy.get('...')` automatically waits for some timeout (which [can be configured](https://docs.cypress.io/guides/references/configuration.html#Timeouts) in Cypress).

If that's still not enough, wait for HTTP requests to terminate. If you "know" that after clicking a button some `GET` call will be made to the server, then you can listen to that HTTP call and wait till it has terminated:

```javascript
describe('some test suite', () => {
  beforeEach(() => {
    // activate the server that
    // listens to HTTP calls
    cy.server();
  });

  it('some test', () => {
    // register a "route listener"
    cy.route('GET', '/api/organization/getTree').as('apiRefreshCall')

    // will trigger HTTP call to fetch data
    cy.get('some-button-selector').click();

    cy.wait('@apiRefreshCall').then(() => {
      // make some assertions
    });
  });
});
```

**Note,** in most cases this shouldn't be necessary and a simple `cy.get('...')` should be enough. Check out [the guide on unnecessary waiting](https://docs.cypress.io/guides/references/best-practices.html#Unnecessary-Waiting) for more details.

### Useful links

- [Official docs](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html)
- [Best practices, Do's and Don'ts](https://docs.cypress.io/guides/references/best-practices.html)
