'use strict';
var HOST = 'http://localhost:8100';
var maxWait = 5000;
var pageLoadWait= 7000;
const { user } =require("../fixtures/user");

module.exports = {
  'Index Page': function (browser) {
    var mainWindow;
    var popupWindow;
    browser
      .url(HOST)
      .waitForElementVisible('body', maxWait)
      .waitForElementNotVisible('title', maxWait)
      .waitForElementVisible('.button-default-md', maxWait)
      .pause(pageLoadWait)
      .assert.title('Brigadista Civil')
      .end();
  },
  'Register Login': function (browser) {
    var mainWindow;
    var popupWindow;
    browser
      .url(HOST+"#/register")
      .waitForElementVisible('body', maxWait)
      .pause(pageLoadWait)
      .setValue('ion-input[formcontrolname="name"] input',user.nome)
      .setValue('ion-input[formcontrolname="password"] input', user.password)
      .setValue('ion-input[formcontrolname="email"] input', user.email)
      .setValue('ion-input[formcontrolname="city"] input', user.city)
      .setValue('ion-input[formcontrolname="bio"] input', user.bio)
      .end();
  }
};
