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

var logLevel = 4; // Default to OFF.

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
   * Sets log level if no cookie. If cookie is present, log level is set if passed a force param.
   *
   * @param {[type]} level logLevel
   * @param {[type]} force arg to force setting level to the level arg
   */
  setLogLevel: function (level, force) {
    logLevel = (!cookieObj.logLevel || force) ?
      (level|| Logger.LOG) :
      cookieObj.logLevel;
    logger('log', [ 'Log level set to', logLevel ]);
  },

  debug: function () {
    logLevel <= Logger.DEBUG && logger('log', arguments);
  },

  log: function () {
    logLevel <= Logger.LOG && logger('log', arguments);
  },

  info: function () {
    logLevel <= Logger.INFO && logger('info', arguments);
  },

  warn: function () {
    logLevel <= Logger.WARN && logger('warn', arguments);
  },

  error: function () {
    logLevel <= Logger.ERROR && logger('error', arguments);
  },

  count: function () {
    logLevel < Logger.INFO && logger('count', arguments);
  },

  time: function () {
    logLevel < Logger.WARN && logger('time', arguments);
  },

  timeEnd: function () {
    logLevel < Logger.WARN && logger('timeEnd', arguments);
  },

  group: function (maxLevel) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (logLevel <= maxLevel) {
      logger('group', args);
      logger('time',  args);
    }
  },

  groupEnd: function (maxLevel) {
    var args = Array.prototype.slice.call(arguments, 1);
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

  // If we want to log something that's computationally expensive, we can pass a
  // function to a Logger method as its sole argument. The function should
  // return the arguments to be logged; the function will only ever be executed
  // in the development environment.
  args = [].slice.call(args);

  if (typeof args[0] === 'function') {
    args = args[0]();
  }

  if (ie) {
    global.console.log(args);
    return;
  }

  try {
    (global.console[level] || global.console.log).apply(global.console, args);
  }
  catch (e) {
    // If we are unable to call, log then we cannot do anything but silently
    // fail. In reality, you will either see your logs or you wont. And if you
    // don't see the logs, there are only two cases: 1 - your logLevel is
    // incorrect or 2 - logging is failing.
  }
}

module.exports = Logger;
