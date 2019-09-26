/*!
 * By:
 * Martin Borg
 */

/**
 * |--------------------------------------------------
 * | Template for testing server requests.
 * | Route does not exists:
 * |--------------------------------------------------
 */

process.env.NODE_ENV = 'test';

import * as server from '../../src/index';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

const should = require('chai').should();

chai.should();
chai.use(chaiHttp);

describe('Api TEST exempel', () => {
  describe('GET /doesnotexist', () => {
    it('404 Unknown Path', (done) => {
      chai
        .request(server)
        .get('/doesnotexist')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');

          done();
        });
    });
  });
});
