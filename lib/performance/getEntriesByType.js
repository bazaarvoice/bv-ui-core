/**
 *  @fileOverview
 *  Performance.getEntriesByType uses the native User Timing API
 *  when available and falls back to a manual implementation if not
 */

// Imports
var global = require('../global');
var perfGetEntries = require('./getEntries').getEntries;

// Determine now (once) if we can use the native User Timing API

// Cache references to native implementation in case they are modified later
var performance = global.performance;
var nativeGetEntriesByType = performance && performance.getEntriesByType;

// Is the User Timing API natively supported?
var isNativeSupported = (typeof nativeGetEntriesByType === 'function');

/**
 *  Native Implementation
 *  Uses the native-supported performance.getEntriesByType function
 */
function nativeImplementation (entryType) {
  return nativeGetEntriesByType.call(performance, entryType);
}

/**
 *  Polyfill Implementation
 *  Manually provides similar functionality to native
 *  performance.getEntriesByType using a filter operation on
 *  a list of all performance marks
 */
function polyfillImplementation (entryType) {
  if (arguments.length === 0) {
    throw new TypeError('Failed to execute \'getEntriesByType\' on \'Performance\': 1 argument required, but only 0 present.');
  }

  return perfGetEntries().filter(function (entry) {
    return entry.entryType === entryType;
  });
}

module.exports = {
  /**
   *  @param {String} [entryType] - The entryType of the mark to filter for
   */
  getEntriesByType: function (entryType) {
    // Note: because the implementation functions explicitly check their number of arguments,
    // we want to preserve the calls exactly as they came in
    var hasArguments = (arguments.length > 0);
    var func = (isNativeSupported ? nativeImplementation : polyfillImplementation);
    return (hasArguments ? func(entryType) : func());
  }
};
