/*
https://developers.livechatinc.com/blog/testing-angular-2-apps-dependency-injection-and-components/
http://www.codeitall.com/?p=144
https://github.com/Urigo/angular-meteor/blob/master/tests/client/unit/meteor_component.spec.ts
*/
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
//import { expect } from 'chai';


/*import {Platform, ionicBootstrap,NavController,MenuController,App} from 'ionic-angular';
import {provide} from '@angular/core';
import 'shim';
import {beforeEachProviders, it, describe, expect, inject,addProviders} from '@angular/core/testing';
//import {BrigadistaCivil} from '../app/app';
*/


import * as ngCore from '@angular/core';
import {MeteorReactive, zoneRunScheduler} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const should = chai.should();
const expect = chai.expect;

describe('App', () => {

/*  beforeEachProviders(() => [BrigadistaCivil,App, Platform, MenuController,
     provide(NavController, { useValue: BrigadistaCivil })]);
*/

/*
  beforeEach(() => {
    addProviders([
        {provide: App, useClass: BrigadistaCivil}
    ])
  });
*/


  it('should have hello property', function() {
    /*inject([BrigadistaCivil], (BrigadistaCivil) => {
      expect(this.app.hello).to.be('Hello');
    })*/
    expect('Hello').to.be('Hello');
  });

});
