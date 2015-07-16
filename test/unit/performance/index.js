/**
 *  @fileOverview Unit tests for the performance/index.js module
 */

var tap = require('tap');
var perfModule = require('../../../lib/performance');

tap.test('Exposeses a now function', function (t) {
  t.type(perfModule.now, 'function');

  // All tests complete
  t.end();
});

tap.test('Exposeses a mark function', function (t) {
  t.type(perfModule.mark, 'function');

  // All tests complete
  t.end();
});
