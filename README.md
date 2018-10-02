# Testworkspace

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
