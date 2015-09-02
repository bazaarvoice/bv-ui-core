/**
 * @fileOverview
 * Unit tests for the performance/now.js module.
 */

// Imports.
var perfNow = require('../../../lib/performance/now.js');

describe('lib/performance/now', function () {

  it('returns a non-negative number', function () {
    var result = perfNow.now();

    // Test 1: it returns a number.
    expect(result).to.be.a('number');

    // Test 2: the number is non-negative.
    expect(result).to.be.above(0);
  });

});
