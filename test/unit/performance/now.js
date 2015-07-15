/**
 *  @fileOverview Unit tests for the performance/now module
 */

var tap = require('tap');
var perfNow = require('../../../lib/performance/now.js');

tap.test('Returns a non-negative number', function (t) {
  var result = perfNow.now();

  // Test 1: It returns a number
  t.type(result, 'number');

  // Test 2: The number is non-negative
  var isNonNegative = (result >= 0);
  t.ok(isNonNegative);

  // All tests complete
  t.end();
});
