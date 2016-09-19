
This is a fork of Ionic2-Meteor-Messenger, but working with accounts-password instead of accounts-phone and latest versions for angular/ionic2.beta11. This version user will login/signin using email/password and not a SMS validation.

To install clone this repo locally and run:

* npm install
* typings install

To run this app do:

* in root folder run `ionic serve`
* inside api folder run `meteor run`
* Is possible to use gulp to watch and recompile files, but ionic serve does that pressing `r` in termina to restart.



## Ionic2-Meteor-Messenger
-----------------------

`ionic2-meteor-messenger` is a step-by-step tutorial that will guide you on how to create a messenger app using:

- [ionic2](ionicframework.com/docs/v2)
- [meteor](meteor.com)
- [angular2](angular.io)
- [angular2-meteor](angular-meteor.com/angular2)
- [webpack](webpack.com)

Fill free to leave comments and issues in the [issues section](github.com/DAB0mB/ionic2-meteor-messenger/issues).

# From scratch

Starting for ionic2-meteor-messenger, remove and add the changes in meteor packages:

* meteor remove okland:accounts-phone
* meteor add accounts-password

Ann apply in app and server:

main.ts:

* replace createUserWithPhone to createUser syntax


## Accounts password module

app.ts:

Remove the 'accounts-phone' and we suppose to add `'accounts-password'`, but i could not find a npm package to that so i can export to the frontend, for example running this gives a error `//import 'accounts-phone';`

This project says that is possible now to usev `'accounts-password'` in frontend:

* npm install accounts-password-client-side --save


Add a method to signin in methods.js.

```
if (Meteor.isServer) {
  Meteor.methods({
    signin(username: string,password: string, profile: Object): void {
      Accounts.createUser({username: username,email: username, password: password, profile: profile})
    }
  });
}
```

* PROBLEM *

I had this issue during the development, you must have a email and username set to a user to guarantee that the login will work.

* https://github.com/idanwe/accounts-password-client-side/issues/7


## Clean up

Remove the verification flow:

* verification.js
* change the call in login.ts to the Profile Page

Delete files for phone:

* sms.ts
* settings.json

## Ionic2

Had some issues with tabs in ionic, so i made a migration to the newest version, here uses different ways to handle alerts, popoves and modals.
