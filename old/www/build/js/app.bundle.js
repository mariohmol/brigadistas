/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	//import 'meteor-client-side';
	//import 'accounts-base-client-side';
	//import 'accounts-password-client-side';
	//import 'api/methods';
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	import { Component, ViewChild, NgModule } from '@angular/core'; //provide
	import { IonicApp, Platform, NavController, MenuController, App, IonicModule } from 'ionic-angular'; //ionicBootstrap
	import { StatusBar } from 'ionic-native';
	/*import {METEOR_PROVIDERS} from 'angular2-meteor';
	import {Meteor} from 'meteor/meteor';
	import {Tracker} from 'meteor/tracker';
	import * as Check from 'meteor/check';
	import * as EJSON from 'meteor/ejson';*/
	import { LoginPage } from './pages/login/login';
	import { TabsPage } from './pages/tabs/tabs';
	import { BrigadesPage } from './pages/brigades/brigades';
	import { FiresPage } from './pages/fires/fires';
	import { ProfilePage } from './pages/profile/profile';
	import { HttpModule } from '@angular/http';
	//import {TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
	import { TranslateService } from 'ng2-translate';
	import { TranslateModule } from 'ng2-translate/ng2-translate';
	import { BrowserModule } from '@angular/platform-browser';
	/*Object.assign(window,
	  Check,
	  EJSON
	);*/
	/*ionicBootstrap(BrigadistaCivil, [METEOR_PROVIDERS, [provide(TranslateLoader, {
	useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
	deps: [Http]
	}),
	TranslateService]]);*/
	/*
	@Component({
	  templateUrl: 'build/pages/app.html' //template: '<ion-nav [root]="rootPage"></ion-nav>',pipes: [TranslatePipe]
	})
	*/
	var BrigadistaCivilApp = (function () {
	    function BrigadistaCivilApp() {
	        this.root = LoginPage;
	    }
	    return BrigadistaCivilApp;
	}());
	BrigadistaCivilApp = __decorate([
	    Component({
	        templateUrl: 'build/pages/app.html'
	    })
	], BrigadistaCivilApp);
	export { BrigadistaCivilApp };
	var BrigadistaCivil = (function () {
	    function BrigadistaCivil(app, platform, translate, menuCtrl) {
	        this.app = app;
	        this.translate = translate;
	        this.menuCtrl = menuCtrl;
	        //this.rootPage = Meteor.user() ? BrigadesPage : LoginPage; //TabsPage
	        this.pages = { LoginPage: LoginPage, TabsPage: TabsPage, BrigadesPage: BrigadesPage, ProfilePage: ProfilePage, FiresPage: FiresPage };
	        platform.ready().then(function () {
	            StatusBar.styleDefault();
	        });
	        this.translateConfig();
	    }
	    BrigadistaCivil.prototype.translateConfig = function () {
	        var userLang = navigator.language.split('-')[0]; // use navigator lang if available
	        userLang = /(pt|en)/gi.test(userLang) ? userLang : 'pt';
	        // this language will be used as a fallback when a translation isn't found in the current language
	        this.translate.setDefaultLang('pt');
	        // the lang to use, if the lang isn't available, it will use the current loader to get them
	        this.translate.use(userLang);
	    };
	    BrigadistaCivil.prototype.openPageName = function (page) {
	        this.openPage(this.pages[page]);
	    };
	    BrigadistaCivil.prototype.openPage = function (page) {
	        this.menuCtrl.close();
	        this.app.getRootNav().setRoot(page);
	        //let nav = this.app.getActiveNav();nav.push(page);
	    };
	    BrigadistaCivil.prototype.pushPage = function (page, data) {
	        this.nav.push(page, data);
	    };
	    BrigadistaCivil.prototype.isAdmin = function () {
	        if ('profile' in localStorage && localStorage['profile'])
	            return false;
	        else
	            return false;
	    };
	    BrigadistaCivil.prototype.isUsuario = function () {
	        if ('profile' in localStorage && localStorage['profile'])
	            return true;
	        else
	            return false;
	    };
	    BrigadistaCivil.prototype.logout = function () {
	        localStorage['profile'] = null;
	        localStorage.removeItem('profile');
	        var deviceToken = localStorage['deviceToken'];
	        localStorage.clear();
	        localStorage['deviceToken'] = deviceToken;
	        this.openPage(LoginPage);
	    };
	    BrigadistaCivil.prototype.headerBar = function () {
	        if (this.isUsuario())
	            return true;
	    };
	    return BrigadistaCivil;
	}());
	__decorate([
	    ViewChild('nav'),
	    __metadata("design:type", NavController)
	], BrigadistaCivil.prototype, "nav", void 0);
	BrigadistaCivil = __decorate([
	    NgModule({
	        declarations: [BrigadistaCivilApp, LoginPage],
	        imports: [BrowserModule, HttpModule, IonicModule.forRoot(BrigadistaCivilApp), TranslateModule.forRoot()],
	        bootstrap: [IonicApp],
	        entryComponents: [LoginPage],
	        providers: []
	    }),
	    __metadata("design:paramtypes", [App, Platform, TranslateService, MenuController])
	], BrigadistaCivil);
	export { BrigadistaCivil };
	/*
	Tracker.autorun((computation) => {
	  //if (Meteor.loggingIn()) return;
	  computation.stop();
	
	  /*ionicBootstrap(BrigadistaCivil, [METEOR_PROVIDERS, [provide(TranslateLoader, {
	  useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
	  deps: [Http]
	}),
	  TranslateService]]);*/
	//});


/***/ }
/******/ ]);
//# sourceMappingURL=app.bundle.js.map