[![Build Status](https://travis-ci.org/mariohmol/brigadistas.svg?branch=master)](https://travis-ci.org/mariohmol/brigadistas)

App that connects civil fire brigades with civil society to fight against the fire.

Here is the web version:

* https://brigadistacivil.com.br/

Development enviroment:

* https://brigadistas.herokuapp.com/

## How that works

<img src="docs/menu.png" alt="Main menu" style="width: 200px;"/>
<img src="docs/fires.png" alt="See fires" style="width: 200px;"/>
<img src="docs/fire.png" alt="Fire Details" style="width: 200px;"/>


<img src="docs/brigades.png" alt="See brigades" style="width: 200px;"/>
<img src="docs/brigade.png" alt="Brigade Details" style="width: 200px;"/>
<img src="docs/enterbrigade.png" alt="Enter Brigade" style="width: 200px;"/>

## Techs

- [ionic2](ionicframework.com/docs/v2)
- [angular2](angular.io)
- [webpack](webpack.com)


### Install


Start with npm packages:

* `npm install` on root folder
* `npm install` on brigadistacivil folder

In case of typings problems:

* typings install
* npm run install-plugins

To run this app :

* `npm run dev` to run express server on port 8484
* `npm run watch` to keep watching angular2 files

### Configure

*Frontend* : The default enviroment is development, you can change to `test` if you would like to test in mobile conecting to your local server. The task `npm run gen` makes the apk taking the production enviroment file in place as default enviroment.

*Backend* : Configure the server side creating a `/.env` file with some important config variables, for example:

```
SMTP_URL=smtp://ENCODED_USER:ENCODED_PASS@SES_SMTP_URL:465
DATABASE_URL='mongodb://localhost/brigadistas'
``


### Android

There is a incompability between google-maps cordova and Geolocation tracker, to fix it manually change the `platforms/android/project.properties`. The idea is to use version 10.x from google maps `com.google.android.gms:play-services-maps:10.0.0` and
`cordova.system.library.2=com.google.android.gms:play-services-location:10.0.0`.

This configurations is to get the latest version, that would be a 10.x and will work.

```
target=android-25
android.library.reference.1=CordovaLib
cordova.system.library.1=com.google.android.gms:play-services-maps:+
cordova.system.library.2=com.google.android.gms:play-services-location:+
cordova.gradle.include.1=cordova-plugin-mauron85-background-geolocation/brigadistacivil-logtofile.gradle
cordova.system.library.3=com.google.android.gms:play-services-location:+
cordova.system.library.4=com.android.support:support-v4:+
```

### Server

Machine using apache (or nginx) where proxy it to a supervisord. To configure the apache follow this configuration:

*General*

Need to set headers to prevent browser to open the Basic Challenge Dialog

```
Header unset WWW-Authenticate
```


You can configure you enviroments

```
SetEnv MONGO_URL mongodb://localhost:27017/mybd\
```

*Using Proxy*

```
ProxyPass / http://localhost:8484/
ProxyPassReverse / http://localhost:8484/
```

*Using Passenger*

Tell Passenger that your app is a bundled Meteor app

```
PassengerAppRoot /home/myapp/brigadistas/
PassengerAppType node
PassengerStartupFile server/server.js
PassengerStickySessions on
```


# Want to help?

Pickup a issue e contact us if you need more instructions!
