/*jshint expr: true*/
const {DATABASE_URL,PORT} = require('../config');
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

const {brigade} = require("../fixtures/brigade");
const { user } =require("../fixtures/user");

chai.use(chaiHttp);

describe('Brigade', () => {

    before(done => {
        server.runServer(() => {
            done();
        });
    });

    after(done => {
        done();
    });
/*
    it('should allow user to create brigade', done => {
        chai.request(app).post('/api/brigade/')
        .auth(user.username, user.password)
        .send(brigade).end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });


    it('should allow admin user to activate a brigade by id', done => {
        let userRegister = Object.assign({}, user);
        delete userRegister.email;
        chai.request(app).put('/api/brigade/activate/id').send(userRegister).end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });

    it('should allow user to get brigades', done => {
        let userRegister = Object.assign({}, user);
        delete userRegister.email;
        chai.request(app).get('/api/brigade/').send(userRegister).end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });

    it('should allow user to get brigade by id', done => {
        let userRegister = Object.assign({}, user);
        delete userRegister.email;
        chai.request(app).get('/api/brigade/id').send(userRegister).end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });

    it('should allow user to update brigade by id', done => {
        let userRegister = Object.assign({}, user);
        delete userRegister.email;
        chai.request(app).put('/api/brigade/id').send(userRegister).end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });


    it('should allow user to see the users from a brigade', done => {
        let userRegister = Object.assign({}, user);
        delete userRegister.email;
        chai.request(app).put('/api/brigade/relation/id/type').send(userRegister).end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });

    it('should allow leader user to add user in brigade', done => {
        let userRegister = Object.assign({}, user);
        delete userRegister.email;
        chai.request(app).put('/api/brigade/relation/brigadeid/type').send(userRegister).end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });

    it('should allow leader user to remove user from brigade', done => {
        let userRegister = Object.assign({}, user);
        delete userRegister.email;
        chai.request(app).delete('/api/brigade/relation/brigadeId/type/userid').send(userRegister).end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });

    it('should allow user to delete brigade by id', done => {
        let userRegister = Object.assign({}, user);
        delete userRegister.email;
        chai.request(app).delete('/api/brigade/id').send(userRegister).end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });
*/
});
