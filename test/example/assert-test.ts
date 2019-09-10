/*!
 * By:
 * Martin Borg
 */

/**
 * |--------------------------------------------------
 * | Shows how to use asserts.
 * | File does nothing.
 * |--------------------------------------------------
 */

process.env.NODE_ENV = 'test';

import * as assert from 'assert';

var should = require('chai').should();

describe('Testing asserts', () => {
  it('It should have an assert', () => {
    assert.equal(true, true);
  });
});
