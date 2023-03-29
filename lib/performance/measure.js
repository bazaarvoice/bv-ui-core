/**
 *  @fileOverview
 *  Performance.measure uses the native User Timing API
 *  when available and falls back to a manual implementation if not
 */

// Imports
var global = require('../global');
var perfNow = require('./now.js').now;
var perfGetEntriesByType = require('./getEntriesByType').getEntriesByType;
var timeline = require('./entries').timeline;

// Determine now (once) if we can use the native User Timing API

// Cache references to native implementation in case they are modified later
var performance = global.performance;
var nativeMeasure = performance && performance.measure;

// Is the User Timing API natively supported?
var isNativeSupported = (typeof nativeMeasure === 'function');

/**
 *  Native Implementation
 *  Uses the native-supported performance.measure function
 */
function nativeImplementation (name, startMark, endMark) {
  if (startMark === undefined) {
    return nativeMeasure.call(performance, name);
  }
  else if (endMark === undefined) {
    return nativeMeasure.call(performance, name, startMark);
  }

  return nativeMeasure.call(performance, name, startMark, endMark);
}

/**
 *  Polyfill Implementation
 *  Manually provides similar functionality to native performance.measure
 *  using a measures list and an array of timeline events
 */
function polyfillImplementation (name, startMark, endMark) {
  // Validation: a measure name must be provided
  if (arguments.length < 1) {
    throw new TypeError('Failed to execute \'measure\' on \'Performance\': 1 argument required, but only 0 present.');
  }

  var marks = perfGetEntriesByType('mark');
  var filteredMarks;

  /**
   * If no startMark was passed, use navigationStart (0) as the startTime
   * per the spec. If no endTime was passed, use performance.now() as the
   * endTime. Otherwise, use the most recent mark(s) with the specified
   * name being passed as startMark and endMark.
   */
  var startTime = 0;
  var endTime = perfNow();

  if (startMark !== undefined) {
    filteredMarks = marks.filter(function (entry) {
      return entry.entryName === startMark;
    });
    if (!filteredMarks.length) {
      throw new Error('Failed to execute \'measure\' on \'Performance\': The mark \'' + startMark + '\' does not exist.');
    }

    // use the most recent mark with the matching name
    startTime = filteredMarks[filteredMarks.length-1].startTime;
  }

  if (endMark !== undefined) {
    filteredMarks = marks.filter(function (entry) {
      return entry.entryName === endMark;
    });
    if (!filteredMarks.length) {
      throw new Error('Failed to execute \'measure\' on \'Performance\': The mark \'' + endMark + '\' does not exist.');
    }
    // use the most recent mark with the matching name
    endTime = filteredMarks[filteredMarks.length-1].startTime;
  }

  // Create the record
  var record = {
    entryType: 'measure',
    name: name,
    startTime: startTime,
    duration: endTime - startTime
  };

  // Push the record to the timeline
  timeline.push(record);
}

module.exports = {
  /**
   *  @param {String} name - The name of the measure to create
   */
  measure: function (name, startMark, endMark) {
    // Note: because the implementation functions explicitly check their number of arguments,
    // we want to preserve the calls exactly as they came in
    var hasArguments = (Object.values(arguments).length > 0);
    var func = (isNativeSupported) ? nativeImplementation : polyfillImplementation;
    return (hasArguments) ? func(name, startMark, endMark) : func();
  }
};
