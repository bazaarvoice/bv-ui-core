/**
 * @fileOverview
 * Unit tests for the fetch Request module.
 */

var Request = require('../../../../lib/polyfills/fetch/Request');

describe('lib/polyfills/fetch/Request', function () {
  it('exports a function as its default export', function () {
    expect(Request).to.be.a('function');
  });
})
