[![Build Status](https://travis-ci.org/mariohmol/brigadistas.svg?branch=master)](https://travis-ci.org/mariohmol/brigadistas)

App that connects civil fire brigades with civil society to fight against the fire.

Here is the web version:

* http://app.brigadistacivil.com.br:3000/

Development enviroment:

* https://brigadistas.herokuapp.com/

# Techs

Based on the tutorial example:

* https://github.com/mariohmol/ionic2-meteor-messenger-password

- [ionic2](ionicframework.com/docs/v2)
- [meteor](meteor.com)
- [angular2](angular.io)
- [angular2-meteor](angular-meteor.com/angular2)
- [webpack](webpack.com)

To install:

* npm install
* typings install
* npm run install-plugins

To run this app do:

* in root folder run `ionic serve`
* inside api folder run `meteor run` or `meteor debug`
* Is possible to use gulp to watch and recompile files, but ionic serve does that pressing `r` in terminal to restart.

## Production

Is possible to use mod_wstunnel for apache2.4, for that check the proxy.conf file in this repo.

Other option is to use passenger standalone running the command `cd api && passenger start`. For this you need to create a `public/` folder inside the `api/` with all the `www/` contents. Guarantee that you have that folder generated running `gulp build` mainly in development environment. So is better to upload this www folder using FTP.

To deploy or update enter in your project folder and run `npm run deploy`
