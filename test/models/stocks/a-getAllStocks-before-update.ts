/*!
 * By:
 * Martin Borg
 */

/**
 * |--------------------------------------------------
 * | Testing GET for /stocks
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

let defaultPrice = 0;

describe('GET & PUT /stocks', () => {
  describe('GET all items', () => {
    it('Should return one item with code 200', (done) => {
      chai
        .request(server)
        .get('/stocks')
        .send({ })
        .end((err, res) => {
          const response = res.body.items;
          res.should.have.status(200);

          defaultPrice = response[0].price;
          assert.equal(response.length, 1);
          assert.equal(response[0].name, 'Gold');
          done();
        });
    });
  });
  describe('PUT to update price randomly', () => {
    it('Should ok message with code 202', (done) => {
      chai
        .request(server)
        .put('/stocks')
        .send({ })
        .end((err, res) => {
          const response = res.body.message;
          res.should.have.status(202);

          assert.equal(response, 'Stocks sucsessfylly updated');
          done();
        });
    });
  });
  describe('Checks if the price has been updated and has the correct range', () => {
    it('Should be larger then 10 and less then 10000', (done) => {
      chai
        .request(server)
        .get('/stocks')
        .send({ })
        .end((err, res) => {
          const response = res.body.items;
          res.should.have.status(200);

          assert.equal(response[0].price > defaultPrice, true);
          done();
        });
    });
  });
});
