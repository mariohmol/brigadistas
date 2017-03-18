/*jshint expr: true*/
const { DATABASE_URL, PORT, ENV } = require('../config');
global.DATABASE_URL = DATABASE_URL;
global.PORT = PORT;
global.ENV = ENV;
const chai = require('chai');
const passport = require("passport");
const mongoose = require('mongoose');
const server = require('../../server/server');
const { User } = require('../../server/user/models');
const { user,adminUser } =require("../fixtures/user");

const expect = chai.expect;
const should = chai.should();
const app = server.app;


describe('Index page', () => {

    before(function (done) {
        mongoose.connect(DATABASE_URL, function(err, dbc){
            mongoose.connection.db.dropDatabase(function(){
              User.create(user).then(e=>{
                return User.create(adminUser);
              }).then(e=>{
                done();
              }).catch(e=>{
                done();
              });
            });
        });
    });

    it('empty the database for testing', done => {
        done();
    });
});
