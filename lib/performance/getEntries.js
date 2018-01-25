/**
 *  @fileOverview
 *  Performance.getEntries uses the native User Timing API
 *  when available and falls back to a manual implementation if not
 */

// Imports
var global = require('../global');
var timeline = require('./entries').timeline;

// Determine now (once) if we can use the native User Timing API

// Cache references to native implementation in case they are modified later
var performance = global.performance;
var nativeGetEntries = performance && performance.getEntries;

// Is the User Timing API natively supported?
var isNativeSupported = (typeof nativeGetEntries === 'function');

/**
 *  Native Implementation
 *  Uses the native-supported performance.getEntries function
 */
function nativeImplementation () {
  return nativeGetEntries.call(performance);
}

/**
 *  Polyfill Implementation
 *  Manually provides similar functionality to native performance.getEntries
 *  using an in-memory array of timeline events
 */
function polyfillImplementation () {
  return timeline;
}

module.exports = {
  getEntries: function () {
    var func = (isNativeSupported ? nativeImplementation : polyfillImplementation);
    return func();
  }
};
