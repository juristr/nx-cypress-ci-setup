FROM cypress/browsers:chrome69

# set working directory
# RUN mkdir /usr/app-e2e
WORKDIR /usr/app-e2e

# add `/usr/app-e2e/node_modules/.bin` to $PATH
ENV PATH /usr/app-e2e/node_modules/.bin:$PATH

# install and cache app dependencies
# COPY package.json /usr/app-e2e/package.json
COPY . /usr/app-e2e

# avoid many lines of progress bars during install
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1

RUN npm ci

# check if the binary was installed successfully
#RUN cypress verify
