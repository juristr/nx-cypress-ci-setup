// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const wp = require('@cypress/webpack-preprocessor');

const fs = require('fs-extra');
const path = require('path');

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('.', 'config', `${file}.json`);

  return fs.readJson(pathToConfigFile);
}

module.exports = (on, config) => {
  const options = {
    webpackOptions: require('../../webpack.config')
  };
  on('file:preprocessor', wp(options));

  const environment = config.env.environment || 'dev';

  // accept a configFile value or use development by default
  const file = `${config.env.project}.${environment}`;
  return getConfigurationByFile(file);
};
