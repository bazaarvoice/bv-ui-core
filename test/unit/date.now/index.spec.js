/**
 * @fileOverview
 * Unit tests for the date.now module.
 */

// Imports.
var dateNow = require('../../../lib/date.now');

describe('lib/date.now', function () {

  it('returns a non-negative number', function () {
    var result = dateNow.now();

    // Test 1: it returns a number.
    expect(result).to.be.a('number');

    // Test 2: the number is non-negative.
    expect(result).to.be.above(0);
  });

});
