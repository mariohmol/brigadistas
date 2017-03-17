/*jshint expr: true*/
const { DATABASE_URL, PORT, ENV } = require('../config');
global.DATABASE_URL = DATABASE_URL;
global.PORT = PORT;
global.ENV = ENV;
const chai = require('chai');
const chaiHttp = require('chai-http');
const passport = require("passport");
const faker = require('faker');
const mongoose = require('mongoose');
const server = require('../../server/server.js');

const expect = chai.expect;
const should = chai.should();
const app = server.app;

chai.use(chaiHttp);

describe('Index page', () => {

    before(function (done) {
        mongoose.connect(DATABASE_URL, function(err, dbc){
            mongoose.connection.db.dropDatabase(function(){
                done();
            });
        });
    });

    it('exists', done => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                //alternative to res.should.be.html
                expect(res).to.have.header('content-type', 'text/html; charset=UTF-8');
                done();
            });
    });
});
