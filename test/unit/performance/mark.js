/**
 *  @fileOverview Unit tests for the performance/mark.js module
 */
var tap = require('tap');
var perfMark = require('../../../lib/performance/mark.js');

tap.test('Can create a mark', function (t) {
  var markName = 'test-mark';

  // Test that there are no errors
  t.doesNotThrow(function () { perfMark.mark(markName); });

  // All tests complete
  t.end();
});

tap.test('Can create multiple marks', function (t) {
  var markName1 = 'test-mark-1';
  var markName2 = 'test-mark-2';

  // Test that there are no errors
  t.doesNotThrow(function () { perfMark.mark(markName1); });
  t.doesNotThrow(function () { perfMark.mark(markName2); });

  // All tests complete
  t.end();
});

tap.test('Can create multiple marks of the same name', function (t) {
  var markName = 'test-mark';

  // Test that there are no errors
  t.doesNotThrow(function () { perfMark.mark(markName); });
  t.doesNotThrow(function () { perfMark.mark(markName); });
  t.doesNotThrow(function () { perfMark.mark(markName); });

  // All tests complete
  t.end();
});

tap.test('Throws an error if no mark name is provided', function (t) {
  // Test that we get an error
  t.throws(function () { perfMark.mark(); });

  // All tests complete
  t.end();
});

tap.test('Throws an error if the mark name is a reserved name', function (t) {
  var markName = 'navigationStart';

  // Test that we get an error
  t.throws(function () { perfMark.mark(markName); });

  // All tests complete
  t.end();
});
