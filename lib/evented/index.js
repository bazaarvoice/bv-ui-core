/* eslint-disable */
/**
 * @fileOverview
 * asEvented v0.4.3 - an event emitter mixin which provides
 * the observer pattern to JavaScript object.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/
/*
 * Originally from https://github.com/mkuklis/asEvented
 *
 * Changelog:
 * - removed UMD wrapper
 * - do not export `bind` or `unbind`
 */
var ArrayProto = Array.prototype;
var nativeIndexOf = ArrayProto.indexOf;
var slice = ArrayProto.slice;

/**
 * Initialize a custom error handler or default to the BV Loader error reporting
 * regardless of application. This will automatically be called at the first
 * invocation of the ".on" method, and can be 
 * event
 * @param {Function} fn - the custom callback to be invoked whenever an error is
 *  detected as the result of a trigger event
 */
function setErrorHandler(fn) {
  this.errorHandler = function(e) {
    global.console.error(e);

    if (fn) {
      fn.apply(this, slice.call(arguments))
    } else {
      if (global && global.BV && global.BV._private) {
        global.BV._private.errorReporter()
          .then(function(reportError) {
            reportError(
              new Error(e),
              {
                extra: arguments
              }
            )
          });
      }
    }
  }
}

function bind(event, fn, errorHandler) {
  var i, part;
  var events = this.events = this.events || {};
  var parts = event.split(/\s+/);
  var num = parts.length;

  for (i = 0; i < num; i++) {
    events[(part = parts[i])] = events[part] || [];
    events[part].push(fn);
  }

  if (this.errorHandler === undefined) {
    this.setErrorHandler(errorHandler ? errorHandler : undefined);
  }

  return this;
}

function one(event, fn) {
  // [notice] The value of fn and fn1 is not equivalent in the case
  // of the following in MSIE.
  //
  // var fn = function fn1 () { alert(fn === fn1) } ie.<9 false
  var fnc = function () {
    this.off(event, fnc);
    fn.apply(this, slice.call(arguments));
  };
  this.on(event, fnc);
  return this;
}

function unbind(event, fn) {
  var eventName, i, index, num, parts;
  var events = this.events;

  if (!events) {
    return;
  }

  parts = event.split(/\s+/);
  for (i = 0, num = parts.length; i < num; i++) {
    if ((eventName = parts[i]) in events !== false) {
      index = (fn) ? _indexOf(events[eventName], fn) : 0;
      if (index !== -1) {
        events[eventName].splice(index, 1);
      }
    }
  }
  return this;
}

function trigger(event) {
  var args, i;
  var events = this.events;

  if (!events || event in events === false) {
    return;
  }

  args = slice.call(arguments, 1);
  for (i = events[event].length - 1; i >= 0; i--) {
    try {
      events[event][i].apply(this, args);
    }
    catch (e) {
      this.errorHandler(e, {
        event: event,
        details: arguments
      });
    }
  }
  return this;
}

// TODO: This is the same as the inArray method provided
// by the utils module. This should be replaced in favor
// of using that.
function _indexOf(array, needle) {
  var i, l;

  if (nativeIndexOf && array.indexOf === nativeIndexOf) {
    return array.indexOf(needle);
  }

  for (i = 0, l = array.length; i < l; i++) {
    if (array[i] === needle) {
      return i;
    }
  }
  return -1;
}

module.exports = function () {
  this.on = bind;
  this.off = unbind;
  this.trigger = this.emit = trigger;
  this.one = this.once = one;
  this.setErrorHandler = setErrorHandler;

  return this;
};
/* eslint-enable */
