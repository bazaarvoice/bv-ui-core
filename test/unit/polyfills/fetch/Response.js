/**
 * @fileOverview
 * Unit tests for the fetch Response module.
 */

var Response = require('../../../../lib/polyfills/fetch/Response');

describe('lib/polyfills/fetch/Response', function () {
  it('exports a function as its default export', function () {
    expect(Response).to.be.a('function');
  });
})
