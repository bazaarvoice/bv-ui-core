/*jshint expr:true */
/*global console:false */

/**
 * @fileOverview Logger provides a wrapper around the console object. It should be used for creating
 * messages that will be helpful for developers. Logger methods can safely be kept in the
 * code -- that is, you don't need to remove them like you need to remove console.log statements.
 *
 * Logger should be used sparingly outside of framework files. When you use it, be thoughtful
 * about the level of logging you choose. Most messages should be at the "debug" or "log" level, so
 * developers can easily silence them. Messages at the info level will generally not be silenced
 * during development, and messages at the warn and error level will almost never be silenced.
 *
 * Logger also provides the ability to make assertions. Assertions are useful when other
 * developers may use your code in unpredictable ways. You can write an assertion so a fellow
 * developer will know at a glance what your code expects, and so that they will get a useful
 * error message if they violate those expectations.
 *
 * @type {Object}
 */

var global = require('../global');
var ie = require('../ie')
var cookie = require('../cookie');

var logLevel = 1; // Default to INFO.

/**
 * Set the logLevel to whatever the _bvui_debug cookie has stored.
 */
var cookieObj = {};
var debugCookie = cookie.read('_bvui_debug');
if (debugCookie) {
  var val;
  var values = debugCookie.split(',');

  for (var i = 0; i < values.length; i++) {
    val = values[i].split(':');
    cookieObj[ val[0] ] = val[1];
  }
}

if (cookieObj.logLevel) {
  logLevel = cookieObj.logLevel;
}

var Logger = {
  // Assign these constants so we don't have to remember them.
  DEBUG: -1, // very noisy
  LOG: 0,
  INFO: 1,   // recommended
  WARN: 2,
  ERROR: 3,
  OFF: 4,    // don't log anything

  getLogLevel: function () {
    return logLevel;
  },
  /**
   * In order to turn off logging, call setLogLevel(Logger.OFF)
   */
  setLogLevel: function (level) {
    logLevel = level || 0;
    logger('log', [ 'Log level set to', logLevel ]);
  },

  debug: function () {
    logLevel < 0 && logger('log', arguments);
  },

  log: function () {
    logLevel < 1 && logger('log', arguments);
  },

  info: function () {
    logLevel < 2 && logger('info', arguments);
  },

  warn: function () {
    logLevel < 3 && logger('warn', arguments);
  },

  error: function () {
    logLevel < 4 && logger('error', arguments);
  },

  count: function () {
    logLevel < 1 && logger('count', arguments);
  },

  time: function () {
    logLevel < 2 && logger('time', arguments);
  },

  timeEnd: function () {
    logLevel < 2 && logger('timeEnd', arguments);
  },

  group: function (maxLevel) {
    var args = arguments.slice(1);
    if (logLevel <= maxLevel) {
      logger('group', args);
      logger('time',  args);
    }
  },

  groupEnd: function (maxLevel) {
    var args = arguments.slice(1);
    if (logLevel <= maxLevel) {
      logger('groupEnd', args);
      logger('timeEnd',  args);
    }
  },

  /**
   * Assert that an expression is true, and throw the provided message if it is not.
   *
   * @param  {Expression} assertion
   * @param  {String} message
   */
  assert: function (assertion, message) {
    if (logLevel === Logger.OFF) {
      return;
    }

    // If we want to assert something computationally expensive, we can pass a function
    // as the sole argument to Logger.assert. The function should return an array with
    // two items: the assertion, and the message.
    if (typeof assertion === 'function') {
      Logger.assert.apply(null, assertion());
      return;
    }

    if (!assertion) {
      throw new Error('Assertion failed: ' + message);
    }
  }
};

function logger (level, args) {
  if (logLevel === Logger.OFF) {
    return;
  }
  if (!global.console) {
    return;
  }

  // If we want to log something that's computationally expensive, we can pass a function
  // to a Logger method as its sole argument. The function should return the arguments
  // to be logged; the function will only ever be executed in the development environment.
  args = [].slice.call(args);

  if (typeof args[0] === 'function') {
    args = args[0]();
  }

  if (ie) {
    console.log(args);
    return;
  }

  try {
    (console[level] || console.log).apply(console, args);
  }
  catch (e) {}
}

module.exports = Logger;
