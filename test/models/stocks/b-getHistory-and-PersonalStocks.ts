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
let defaultName = '';

describe('GET History and Personal', () => {
  describe('GET all history', () => {
    it('Should return a list with 1 entry of gold', (done) => {
      chai
        .request(server)
        .get('/history/stocks')
        .send({ })
        .end((err, res) => {
          const response = res.body.data;
          res.should.have.status(200);
          assert.equal(response.length, 1);

          defaultPrice = response[0].old_price;
          defaultName = response[0].item_name;
          assert.equal(defaultPrice, 5.65);
          assert.equal(defaultName, 'Gold');
          done();
        });
    });
  });

  describe('GET all Personal', () => {
    it('Should be empty', (done) => {
      chai
        .request(server)
        .get('/stocks/user')
        .send({ })
        .end((err, res) => {
          const response = res.body.data;
          res.should.have.status(200);
          assert.equal(response.length, 0);
          done();
        });
    });
  });

});
