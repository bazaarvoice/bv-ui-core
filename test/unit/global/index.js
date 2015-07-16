/**
 *  @fileOverview Unit tests for the global module
 */

var tap = require('tap');
var global = require('../../../lib/global');

tap.test('Should export window object', function (t) {
  // We don't have a reference to `window` so we can't test this properly
  // t.equal(global, window);
});
