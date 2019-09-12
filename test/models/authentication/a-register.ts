/*!
 * By:
 * Martin Borg
 */

/**
 * |--------------------------------------------------
 * | Testing POST for /register
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
        .post('/register')
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
        .post('/register')
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
        .post('/register')
        .send({ email: 'test@test.com', password: '' })
        .end((err, res) => {
          const response = res.body.errors;

          res.should.have.status(401);
          assert.equal(response.title, 'Missing values.');

          done();
        });
    });
  });
  describe('Creating user', () => {
    it('Should create email: test@test.se & password: pass', (done) => {
      chai
        .request(server)
        .post('/register')
        .send({ email: 'test@test.se', password: 'pass', firstName: 'Test', lastName: 'Express' })
        .end((err, res) => {
          const response = res.body.data;

          res.should.have.status(201);
          assert.equal(response.message, 'User successfully registered.');

          done();
        });
    });
  });
  describe('Creating user (again)', () => {
    it('Should return error', (done) => {
      chai
        .request(server)
        .post('/register')
        .send({ email: 'test@test.se', password: 'pass', firstName: 'Test', lastName: 'Express' })
        .end((err, res) => {
          const response = res.body.errors;

          res.should.have.status(500);
          assert.equal(response.title, 'Database error.');

          done();
        });
    });
  });
});
