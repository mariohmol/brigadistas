[![Build Status](https://travis-ci.org/ramalabs/brigadistas.svg?branch=master)](https://travis-ci.org/ramalabs/brigadistas)

App that connects civil fire brigades with civil society to fight against the fire.

Here is the web version:

* https://brigadistacivil.com.br/

Android:

* https://play.google.com/store/apps/details?id=br.com.brigadistacivil

iOS:

* https://itunes.apple.com/us/app/brigadista-civil/id1217301893

Development enviroment:

* https://brigadistas.herokuapp.com/


<!-- ## How that works
 <img src="docs/menu.png" alt="Main menu" width="200px"/> -->


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


#### iOS

Install libs mostly for iOS enviroment:

* npm install -g ios-deploy --unsafe-perm=true --allow-root
* sudo gem install cocoapods
* pod setup

For Push we are using the new style APNs - Provider Authentication Tokens., where generates a .p8 file used to make the push and this file must be on `server/config/ios.p8`.

Need to create in Identifiers -> Your App -> Edit -> Push Notifications 

 * https://developer.apple.com/account/ios/identifier/bundle

You need to create a CSR in your MAC and use to create a development certificate. Create another CSR in your server and use it to create a production certificate.

Use `openssl x509 -inform DER -in certificate.cer -out certificate.crt` this to convert the .cer file into .crt, and copy .crt file into /etc/ssl/certs/. More details in https://github.com/dkhamsing/apns-guide/issues/6


To run the app in Xcode or deploy to applestore use .xcworkspace file genereated in `platforms/ios`.

#### Desktop

We use electron to generate the desktop versions, its needed to install that globally:

* npm install -g electron

To build locally you can run `npm run electron`, if you would like to generate the app for each arch you can use for ex. `npm run genlinux`

### Run

To run this app :

* `npm run dev` to run express server on port 8484
* `npm run watch` to keep watching angular2 files

Throubleshooting with mobile is very usual to remove the platform, add again and build: ex.: `ionic platform remove ios`

You can install the the ionic plugins manually, like:

```
ionic plugin add cordova-plugin-mauron85-background-geolocation
ionic plugin add cordova-plugin-geolocation
ionic plugin add cordova-plugin-crosswalk-webview --save
ionic plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="XYZ" --variable API_KEY_FOR_IOS="XYZ" --save
ionic plugin add https://github.com/Telerik-Verified-Plugins/ImagePicker
ionic plugin add cordova-plugin-camera
```

```
npm install --save @ionic-native/background-geolocation
npm install --save @ionic-native/google-maps
npm install --save @ionic-native/push
npm install @ionic-native/core --save
npm install @ionic-native/geolocation --save
npm install --save @ionic-native/image-picker
npm install --save @ionic-native/camera
```


### Configure

*Frontend* : The default enviroment is development, you can change to `test` if you would like to test in mobile conecting to your local server. The task `npm run gen` makes the apk taking the production enviroment file in place as default enviroment.

*Backend* : Configure the server side creating a `/.env` file with some important config variables, for example:

```
SMTP_URL=smtp://ENCODED_USER:ENCODED_PASS@SES_SMTP_URL:465
DATABASE_URL='mongodb://localhost/brigadistas'
```

#### Plugins

Google maps plugin needs to be installed manually in the app. Go to the `brigadistacivil` folder and run the follow example (changin `XYZ` with your real googleapikey):

```
cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="XYZ" --variable API_KEY_FOR_IOS="XYZ"
```


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

### Debug

We use VSCode as development enviroment to connect to node or browser and debug using the IDE.

** FRONTEND **

To debug front end, open 2 terminals in vscode , one with run dev other with run watch. Open the browser in link `http://localhost:8484/#/fires/`, go to debug tab in VSCode and choose Attach to Chrome.

To connect using Chrome, you need to run it with debug port, for example 
`/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome  --remote-debugging-port=9222`

** BACKEND **

For backend you have to go in VSCode debug and start Launch Program, that will be in place of run dev. Then do npm run watch , open the browser and you will be able to debug the backend.

### Server

Machine using apache (or nginx) where proxy it to a supervisord. To configure the apache follow this configuration:

*General*

Need to set headers to prevent browser to open the Basic Challenge Dialog

```
Header unset WWW-Authenticate
```


You can configure you environments

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

# Tests

We have tests for frontend, backend and e2e. First install global dependencies, `npm install karma-cli phantomjs-prebuilt -g` then to to run tests `npm run test`.

## Frontend

We have tests for frontend using `npm run test-app`.

## Backend

Testes for backend uses `mocha` and `chai-http` to make requests to backend. To run use `npm run test-server`

## End to End

In a test end to end we open a browser with a `PhantomJS`. To run this tests use `npm run test-e2e`.


# Want to help?

Pickup a issue e contact us if you need more instructions!
