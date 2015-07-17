/**
 *  @fileOverview
 *  Unit tests for the date.now module
 */

// Imports
var test = require('tape');
var dateNow = require('../../../lib/date.now');

test('Returns a non-negative number', function (t) {
  var result = dateNow.now();

  // Test 1: it returns a number
  t.equal(typeof result, 'number');

  // Test 2: the number is non-negative
  t.ok(result >= 0, 'should be non-negative');

  // All tests complete
  t.end();
});
