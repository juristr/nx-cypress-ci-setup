# Testworkspace

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) using [Nrwl Nx](https://nrwl.io/nx).

## Nrwl Extensions for Angular (Nx)

<a href="https://nrwl.io/nx"><img src="https://preview.ibb.co/mW6sdw/nx_logo.png"></a>

Nx is an open source toolkit for enterprise Angular applications.

Nx is designed to help you create and build enterprise grade Angular applications. It provides an opinionated approach to application project structure and patterns.

## Quick Start & Documentation

[Watch a 5-minute video on how to get started with Nx.](http://nrwl.io/nx)

## Generate your first application

Run `ng generate app myapp` to generate an application. When using Nx, you can create multiple applications and libraries in the same CLI workspace. Read more [here](http://nrwl.io/nx).

## Development server

Run `ng serve --project=myapp` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name --project=myapp` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build --project=myapp` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Run e2e tests inside Docker

### Build docker container

```
$ docker-compose build
```

The respective docker files are in the root `Dockerfile` for the Angular app and in the `e2e/Dockerfile.cypress` for the Cypress test execution. All containers install the dependencies by themselves and do not include them via folder mounts. The reason is that for native packages that wouldn't work when executing the npm installation on OSX but running the build inside the container which runs on Linux.

### Execute the tests

Then execute the tests like

```
$ docker-compose run cypress-e2e ./node_modules/.bin/cypress run --env project=demoapp,environment=ci
```

### Build just a single container

To build single containers, you can also directly target a docker-compose service, for example:

```
$ docker-compose build cypress-e2e
```
