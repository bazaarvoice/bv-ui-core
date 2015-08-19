/**
 *  @fileOverview
 *  Unit tests for the body module
 */

// Imports
var test = require('tape');
var body = require('../../../lib/body');

test('Should return the body', function (t) {
  var result = body();

  // Test 1: it returns the body
  t.equal(result.tagName, 'BODY');

  // All tests complete
  t.end();
});
