/**
 *  @fileOverview
 *  Performance.getEntriesByName uses the native User Timing API
 *  when available and falls back to a manual implementation if not
 */

// Imports
var global = require('../global');
var perfGetEntries = require('./getEntries').getEntries;

// Determine now (once) if we can use the native User Timing API

// Cache references to native implementation in case they are modified later
var performance = global.performance;
var nativeGetEntriesByName = performance && performance.getEntriesByName;

// Is the User Timing API natively supported?
var isNativeSupported = (typeof nativeGetEntriesByName === 'function');

/**
 *  Native Implementation
 *  Uses the native-supported performance.getEntriesByName function
 */
function nativeImplementation (name, entryType) {
  return nativeGetEntriesByName.call(performance, name, entryType);
}

/**
 *  Polyfill Implementation
 *  Manually provides similar functionality to native
 *  performance.getEntriesByName using a filter operation on
 *  a list of all performance marks
 */
function polyfillImplementation (name, entryType) {
  if (arguments.length === 0) {
    throw new TypeError('Failed to execute \'getEntriesByName\' on \'Performance\': 1 argument required, but only 0 present.');
  }

  return perfGetEntries().filter(function (entry) {
    if (entry.name === name) {
      if (typeof entryType === 'undefined' || entry.entryType === entryType) {
        return entry;
      }
    }
  });
}

module.exports = {
  /**
   *  @param {String} name - The name of the mark to filter for
   *  @param {String} [entryType] - The entryType of the mark to filter for
   */
  getEntriesByName: function (name, entryType) {
    // Note: because the implementation functions explicitly check their number of arguments,
    // we want to preserve the calls exactly as they came in
   
    var hasArguments = (arguments.length > 0);
    var func = (isNativeSupported ? nativeImplementation : polyfillImplementation);
    return (hasArguments ? func(name, entryType) : func());
  }
};
