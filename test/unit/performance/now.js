/**
 *  @fileOverview Unit tests for the performance/now.js module
 */

var test = require('tape');
var perfNow = require('../../../lib/performance/now.js');

test('Returns a non-negative number', function (t) {
  var result = perfNow.now();

  // Test 1: It returns a number
  t.equal(typeof result, 'number');

  // Test 2: The number is non-negative
  t.ok(result >= 0);

  // All tests complete
  t.end();
});
