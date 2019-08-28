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
import { escapeHtml } from '../../src/methods/escape';

const html = '<h1>A h1 tag</h1>';
const markdown = '# A h1 tag';
const mix = `# A h1 tag\n\n<script>alert("hello");</script>`;

const noParam = escapeHtml();
const emptyString = escapeHtml('');

const htmlString = escapeHtml(html);
const markdownString = escapeHtml(markdown);
const mixedString = escapeHtml(mix);

// tslint:disable: quotemark
const results = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

describe('escape.escapeHtml module with:', () => {
  describe('No parameter', () => {
    it('Should be an empty string', () => {
      assert.equal(noParam, '');
    });
  });
  describe('Empty string', () => {
    it('Should be an empty string', () => {
      assert.equal(emptyString, '');
    });
  });
  describe('Html string', () => {
    it('Should remove replace html code with unicode', () => {
      assert.notEqual(htmlString, html);
    });
  });
  describe('Markdown string', () => {
    it('Should keep markdown as it is', () => {
      assert.equal(markdownString, markdown);
    });
  });
  describe('Both markdown and html string', () => {
    it('Makes sure it filters out tags with propper content inbetween', () => {
      assert.notEqual(mixedString, mix);
    });
  });
  describe('Checking for propper unicode values', () => {
    it('Makes sure all keys works', () => {
      assert.equal(results['&'], escapeHtml('&'));
      assert.equal(results['<'], escapeHtml('<'));
      assert.equal(results['"'], escapeHtml('"'));
      assert.equal(results["'"], escapeHtml("'"));
      assert.equal(results['>'], escapeHtml('>'));
      assert.equal(results['/'], escapeHtml('/'));
    });
  });
});
