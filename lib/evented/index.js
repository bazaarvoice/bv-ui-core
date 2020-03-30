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
 * By default, we should simply log the error to the console.
 */
function defaultErrorHandler(e) {
  global.console.error(e);
}

/**
 * Initialize a custom error handler for this instance, which may decide to log or even re-throw the error.
 *
 * @param {Function} fn - the custom callback to be invoked whenever an error is
 *  detected as the result of a trigger event
 */
function setErrorHandler(fn) {
  this.eventErrorHandler = fn;
}

function bind(event, fn) {
  var i, part;
  var events = this.events = this.events || {};
  var parts = event.split(/\s+/);
  var num = parts.length;

  for (i = 0; i < num; i++) {
    events[(part = parts[i])] = events[part] || [];
    events[part].push(fn);
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
      (this.eventErrorHandler || defaultErrorHandler).call(this, e, {
        event: event,
        data: args
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
