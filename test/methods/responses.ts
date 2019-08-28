/*!
 * By:
 * Martin Borg
 */

/**
 * |--------------------------------------------------
 * | Testing responses module.
 * |--------------------------------------------------
 */

import * as assert from 'assert';
import { responses } from '../../src/methods/responses';
import { it, describe } from 'mocha';

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
  describe('responses.checkValues', () => {
    it('Checks when return true', () => {
      assert.equal(responses.checkValues(['a', 1]), true);
    });
  });
  describe('responses.checkValues', () => {
    it('Checks when return false', () => {
      assert.equal(responses.checkValues(['s', false]), false);
    });
  });
  describe('responses.checkValues', () => {
    it('Checks when empty string', () => {
      assert.equal(responses.checkValues(['', 's']), false);
    });
  });
});
