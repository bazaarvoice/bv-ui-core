/**
 * @fileOverview
 * Unit tests for the fetch Headers module.
 */

var Headers = require('../../../../lib/polyfills/fetch/Headers');

describe('lib/polyfills/fetch/Headers', function () {
  it('exports a function as its default export', function () {
    expect(Headers).to.be.a('function');
  });
})
