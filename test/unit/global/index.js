/**
 *  @fileOverview Unit tests for the global module
 */
var test = require('tape');
var global = require('../../../lib/global');

test('Should export window', function (t) {
  // If we have access to the window object, compare against it
  if (typeof window !== 'undefined') {
    t.equal(global, window);
  }

  // All tests complete
  t.end();
});
