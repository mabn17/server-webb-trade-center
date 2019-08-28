/*!
 * By:
 * Martin Borg
 */

/**
 * |--------------------------------------------------
 * | Testing POST for /login
 * |--------------------------------------------------
 */

process.env.NODE_ENV = 'test';

import * as server from '../../../src/index';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as assert from 'assert';

const should = require('chai').should();

chai.should();
chai.use(chaiHttp);

describe('POST /register', () => {
  describe('With no data given', () => {
    it('Should return \'Missing values\'', (done) => {
      chai
        .request(server)
        .post('/login')
        .send({ })
        .end((err, res) => {
          const response = res.body.errors;

          res.should.have.status(401);
          assert.equal(response.title, 'Missing values.');
          done();
        });
    });
  });
  describe('With empty string email and real password', () => {
    it('Should return \'Missing values\'', (done) => {
      chai
        .request(server)
        .post('/login')
        .send({ email: '', password: 'pass' })
        .end((err, res) => {
          const response = res.body.errors;

          res.should.have.status(401);
          assert.equal(response.title, 'Missing values.');
          done();
        });
    });
  });
  describe('With empty string password and real email', () => {
    it('Should return \'Missing values\'', (done) => {
      chai
        .request(server)
        .post('/login')
        .send({ email: 'test@test.com', password: '' })
        .end((err, res) => {
          const response = res.body.errors;

          res.should.have.status(401);
          assert.equal(response.title, 'Missing values.');
          done();
        });
    });
  });
  describe('Logging in', () => {
    it('Should return 200, email: test@test.se & password: pass', (done) => {
      chai
        .request(server)
        .post('/login')
        .send({ email: 'test@test.se', password: 'pass' })
        .end((err, res) => {
          const response = res.body.data;

          res.should.have.status(200);
          assert.equal(response.user.email, 'test@test.se');
          done();
        });
    });
  });
  describe('Wrong password', () => {
    it('Should return wrong password, email: test@test.se & password: pass1', (done) => {
      chai
        .request(server)
        .post('/login')
        .send({ email: 'test@test.se', password: 'pass1' })
        .end((err, res) => {
          const response = res.body.errors;

          res.should.have.status(401);
          assert.equal(response.title, 'Wrong password.');
          done();
        });
    });
  });
  describe('Nonexistant email', () => {
    it('Should return wrong password, email: nope@nope.se & password: pass1', (done) => {
      chai
        .request(server)
        .post('/login')
        .send({ email: 'nope@nope.se', password: 'pass' })
        .end((err, res) => {
          const response = res.body.errors;

          res.should.have.status(401);
          assert.equal(response.title, 'User not found.');
          done();
        });
    });
  });
});
