/*!
 * By:
 * Martin Borg
 */

/**
 * |--------------------------------------------------
 * | Buys then checks personal stocks + assets
 * | Sells then checks personal stocks + assets
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

describe('Buys, Sells and checks if all values updates', () => {
  describe('Buy stock', () => {
    it('Should return a list with 1 entry of gold', (done) => {
      chai
        .request(server)
        .post('/user/stocks/buy')
        .send({ stockToBuy: 'Gold', amountToBuy: 1 })
        .end((err, res) => {
          const response = res.body.message;
          res.should.have.status(201);

          assert.equal(typeof response, typeof 'string');
          done();
        });
    });
  });
  describe('GET personal stocks', () => {
    it('Should be higher', (done) => {
      chai
        .request(server)
        .get('/stocks/user')
        .send({ })
        .end((err, res) => {
          const response = res.body.data;
          res.should.have.status(200);

          assert.equal(response.length, 1);
          assert.equal(response[0]['item_name'], 'Gold');
          assert.equal(response[0]['amount'], 1);
          done();
        });
    });
  });
  describe('checks if assets has decreesed', () => {
    it('Should be something cool', (done) => {
      chai
        .request(server)
        .get('/user/self')
        .send({ })
        .end((err, res) => {
          const response = res.body.data;
          res.should.have.status(200);
          assert.equal(response.assets < 100, true);
          done();
        });
    });
  });

  describe('Sell stock', () => {
    it('', (done) => {
      chai
        .request(server)
        .post('/user/stocks/sell')
        .send({ stockToSell: 'Gold', amountToSell: 1 })
        .end((err, res) => {
          const response = res.body.data.message;
          res.should.have.status(200);
          assert.equal(typeof response, typeof 'string');

          done();
        });
    });
  });
  describe('Checks if personal stock has decreesed', () => {
    it('', (done) => {
      chai
        .request(server)
        .get('/stocks/user')
        .send({ })
        .end((err, res) => {
          const response = res.body.data;
          res.should.have.status(200);

          assert.equal(response.length, 1);
          assert.equal(response[0]['item_name'], 'Gold');
          assert.equal(response[0]['amount'], 0);

          done();
        });
    });
  });
  describe('Checks if assets has increesed', () => {
    it('', (done) => {
      chai
        .request(server)
        .get('/user/self')
        .send({ })
        .end((err, res) => {
          // Compare it to -> higher then 100
          const response = res.body.data;
          res.should.have.status(200);
          assert.equal(response.assets > 100, true);

          done();
        });
    });
  });

  describe('Buy invalid number of stocks', () => {
    it('Should return 400', (done) => {
      chai
        .request(server)
        .post('/user/stocks/buy')
        .send({ stockToBuy: 'Gold', amountToBuy: 10000 })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });
  });

  describe('Buy nonexisting stock', () => {
    it('Should return 400', (done) => {
      chai
        .request(server)
        .post('/user/stocks/buy')
        .send({ stockToBuy: 'Golders', amountToBuy: 1 })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });
  });

  describe('Buy with no params stock', () => {
    it('Should return 400', (done) => {
      chai
        .request(server)
        .post('/user/stocks/buy')
        .send({  })
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });
  });

  describe('Sell woth no params', () => {
    it('Should return 404', (done) => {
      chai
        .request(server)
        .post('/user/stocks/sell')
        .send({ })
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });
  });

  describe('Updating User Assets', () => {
    it('Should return 400, no params', (done) => {
      chai
        .request(server)
        .post('/user/update/assets')
        .send({ })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });
  });

  describe('Updating user assets', () => {
    it('Should return 202', (done) => {
      chai
        .request(server)
        .post('/user/update/assets')
        .send({ newAmount: 100.2 })
        .end((err, res) => {
          res.should.have.status(202);

          done();
        });
    });
  });

  describe('Updating user assets with wrong values', () => {
    it('Should return 400 with string', (done) => {
      chai
        .request(server)
        .post('/user/update/assets')
        .send({ newAmount: 'a' })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });
    it('Should return 400 with 0', (done) => {
      chai
        .request(server)
        .post('/user/update/assets')
        .send({ newAmount: 0 })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });
    it('Should return 400 with -1', (done) => {
      chai
        .request(server)
        .post('/user/update/assets')
        .send({ newAmount: -1 })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });
  });
});
