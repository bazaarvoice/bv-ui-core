/**
 * @fileOverview
 * Unit tests for the performance/index.js module.
 */

// Imports.
var perfModule = require('../../../lib/performance');

describe('lib/performance', function () {

  it('exposes a now function', function () {
    expect(perfModule.now).to.be.a('function');
  });

  it('exposes a mark function', function () {
    expect(perfModule.mark).to.be.a('function');
  });

});
