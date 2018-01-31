/**
 *  @fileOverview
 *  Performance.mark uses the native User Timing API
 *  when available and falls back to a manual implementation if not
 */

// Imports
var global = require('../global');
var perfNow = require('./now.js');
var timeline = require('./entries').timeline;

// Determine now (once) if we can use the native User Timing API

// Cache references to native implementation in case they are modified later
var performance = global.performance;
var nativeMark = performance && performance.mark;

// Is the User Timing API natively supported?
var isNativeSupported = (typeof nativeMark === 'function');

// Per http://www.w3.org/TR/user-timing/#extensions-performance-interface,
// the mark name cannot be any of the attributes in the PerformanceTiming
// interface: http://www.w3.org/TR/navigation-timing/#performancetiming.
var reservedNames = {
  navigationStart: 1,
  unloadEventStart: 1,
  unloadEventEnd: 1,
  redirectStart: 1,
  redirectEnd: 1,
  fetchStart: 1,
  domainLookupStart: 1,
  domainLookupEnd: 1,
  connectStart: 1,
  connectEnd: 1,
  secureConnectionStart: 1,
  requestStart: 1,
  responseStart: 1,
  responseEnd: 1,
  domLoading: 1,
  domInteractive: 1,
  domContentLoadedEventStart: 1,
  domContentLoadedEventEnd: 1,
  domComplete: 1,
  loadEventStart: 1,
  loadEventEnd: 1
};

/**
 *  Native Implementation
 *  Uses the native-supported performance.mark function
 */
function nativeImplementation (name) {
  return nativeMark.call(performance, name);
}

/**
 *  Polyfill Implementation
 *  Manually provides similar functionality to native performance.mark
 *  using a marks list and an array of timeline events
 */
function polyfillImplementation (name) {
  // Validation: a mark name must be provided
  if (arguments.length < 1) {
    throw new SyntaxError('Cannot set mark without a name');
  }

  // Validation: the mark name cannot be one of the reserved names
  if (name in reservedNames) {
    throw new SyntaxError('Cannot set mark with reserved name "' + name + '"');
  }

  // Validation passed, can proceed

  // Create the record
  var record = {
    entryType: 'mark',
    name: name,
    startTime: perfNow.now(),
    duration: 0
  };

  // Push the record to the timeline
  timeline.push(record);
}

module.exports = {
  /**
   *  @param {String} name - The name of the mark to create
   */
  mark: function (name) {
    // Note: because the implementation functions explicitly check their number of arguments,
    // we want to preserve the calls exactly as they came in
    var hasArguments = (arguments.length > 0);
    var func = (isNativeSupported) ? nativeImplementation : polyfillImplementation;
    return (hasArguments) ? func(name) : func();
  }
};
