/**
 *  @fileOverview
 *  Unit tests for the performance/index.js module
 */

var test = require('tape');
var perfModule = require('../../../lib/performance');

test('Exposeses a now function', function (t) {
  t.equal(typeof perfModule.now, 'function');

  // All tests complete
  t.end();
});

test('Exposeses a mark function', function (t) {
  t.equal(typeof perfModule.mark, 'function');

  // All tests complete
  t.end();
});
