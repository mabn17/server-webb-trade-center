/*!
 * By:
 * Martin Borg
 */

/**
 * |--------------------------------------------------
 * | Testing escape module.
 * |--------------------------------------------------
 */

import * as assert from 'assert';
import { responses } from '../../src/methods/responses';

// tslint:disable-next-line
var should = require('chai').should();

const res = responses.getErrorMessage('s', 't', 'd', 1);

describe('responses module with:', () => {
  describe('responses.getErrorMessage', () => {
    it('Checks so that the right values gets returned', () => {
      assert.equal(res.errors.source, 's');
      assert.equal(res.errors.title, 't');
      assert.equal(res.errors.detail, 'd');
      assert.equal(res.errors.status, 1);
    });
  });
  describe('responses.getErrorMessage', () => {
    it('Checks that it follows ExpressError types', () => {
      assert.equal(typeof res.errors.status, 'number');
      assert.equal(typeof res.errors.source, 'string');
    });
  });
});
