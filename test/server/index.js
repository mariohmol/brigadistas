/*jshint expr: true*/
const { DATABASE_URL } = require('../config');
global.DATABASE_URL = DATABASE_URL;
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
