/**
 * @fileOverview
 * Unit tests for the fetch function module.
 */

var fetch = require('../../../../lib/polyfills/fetch/fetch');

describe('lib/polyfills/fetch/fetch', function () {
  it('exports a function as its default export', function () {
    expect(fetch).to.be.a('function');
  });
})
