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

const userFixtures=require("./fixtures/user.json");
chai.use(chaiHttp);


describe('Authentication', () => {

    before(done => {
        server.runServer(()=> {
          /*  app.request.isAuthenticated = () => {
                return true;
            };*/
            done();
        });
    });

    after(done => {
        /*app.request.isAuthenticated = () => {
            return false;
        };*/
        done();
    });
    /*
    beforeEach(done => {
        app.request.user = {
            twitchId: 1,
            username: "one",
            clips: []
        };
        done();
    });

    afterEach(done => {
        done();
    });
    */

    it('should allow user do signup', done => {
        chai.request(app)
            .post('/api/user/register')
            .send({username: userFixtures.email, "password": userFixtures.password,
              name: faker.name.firstName(),
            bio: faker.lorem.sentence(), city: faker.address.city()})
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });

    it('should allow user to login', done => {
        chai.request(app)
            .post('/api/user/login')
            .auth(userFixtures.username, userFixtures.password)
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
