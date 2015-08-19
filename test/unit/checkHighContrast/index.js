/**
 * @fileOverview Unit tests for the parseUri utility
 */

var test = require('tape');
var checkHighContrast = require('../../../lib/checkHighContrast');

// Test a simple case
test('checkHighContrast normally returns false', function (t) {
  t.ok(!checkHighContrast(document.body));
  t.end();
});
