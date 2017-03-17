'use strict';
var HOST = 'http://localhost:8100';
var maxWait = 10000;

module.exports = {
  'User Login': function (browser) {
    var mainWindow;
    var popupWindow;
    browser
      .url(HOST)

      .waitForElementVisible('body', maxWait)
        .waitForElementNotVisible('title', maxWait)

      .waitForElementVisible('.button-default-md', maxWait)
      .assert.title('Brigadista Civil')

      .end();
  }
};
