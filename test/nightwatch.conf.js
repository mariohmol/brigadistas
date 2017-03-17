'use strict';

const jar = require('selenium-server-standalone-jar');
const phantomjs = require('phantomjs-prebuilt');
const chromedriver = require('chromedriver');


const browserName = 'chrome';

module.exports = (function (settings) {
  settings.selenium.server_path = jar.path;
  settings.selenium.cli_args['webdriver.chrome.driver'] = chromedriver.path;
  settings.test_settings.default.desiredCapabilities['phantomjs.binary.path'] = phantomjs.path;
  if (browserName) {
    settings.test_settings.default.desiredCapabilities['browserName'] = browserName;
  }
  return settings;
})(require('./helpers/nightwatch.json'));
