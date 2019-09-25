/**
 *  @fileOverview Provides a reference to the global object
 *  the below solution works in ES3+ environment and doesn't violates CSP in Chrome apps 
 *  see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
 */
'use strict'; /* eslint strict:0 */

var getGlobal = function () {
  if (typeof globalThis !== 'undefined') { return globalThis; }
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};

module.exports = getGlobal();