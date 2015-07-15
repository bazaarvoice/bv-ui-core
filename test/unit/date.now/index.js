/**
 *  @fileOverview Unit tests for the date.now module
 */

var tap = require('tap');
var dateNow = require('../../../lib/date.now');

tap.test('Returns a non-negative number', function (t) {
  var result = dateNow.now();

  // Test 1: it returns a number
  t.type(result, 'number');

  // Test 2: the number is non-negative
  var isNonNegative = (result >= 0);
  t.ok(isNonNegative);

  // All tests complete
  t.end();
});
