/*jshint expr: true*/
const { DATABASE_URL } = require('../config');
global.DATABASE_URL = DATABASE_URL;
global.PORT = PORT;
const chai = require('chai');
const chaiHttp = require('chai-http');
const passport = require("passport");
const faker = require('faker');
const mongoose = require('mongoose');
const server = require('../../server/server.js');

const expect = chai.expect;
const should = chai.should();
const app = server.app;

const { newUser } =require("../fixtures/user");

chai.use(chaiHttp);


describe('Authentication', () => {

    before(done => {
        server.runServer(()=> {
            done();
        });
    });

    after(done => {
        done();
    });


    it('should allow user do signup', done => {
        let userRegister = Object.assign({},newUser);
        delete userRegister.email;
        chai.request(app)
            .post('/api/user/register')
            .send(userRegister)
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });

    it('should allow user to login', done => {
        chai.request(app)
            .post('/api/user/login')
            .auth(newUser.username, newUser.password)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('should logout the user', done => {
        chai.request(app)
            .get('/api/user/logout')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
