/**
 *  @fileOverview
 *  Provides a unified interface for getting the number of
 *  milliseconds elapsed since 1 Jan 1970
 *
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 */

// Imports
var global = require('../global');

// Cache references for speed and to guard against shenanigans
var nativeDate = global.Date;
var nativeNow = nativeDate && nativeDate.now;

// Is Date.now natively supported?
var isNativeSupported = (typeof nativeNow === 'function');

/**
 *  Native Implementation
 *  Uses the natively-supported Date.now
 */
function nativeImplementation () {
  return nativeNow.call(nativeDate);
}

/**
 *  Polyfill Implementation
 *  Provides similar functionality by using new Date().getTime()
 */
function polyfillImplementation () {
  return new nativeDate().getTime(); /*eslint new-cap:0*/
}

module.exports = {
  now : function () {
    var func = (isNativeSupported) ? nativeImplementation : polyfillImplementation;
    return func();
  }
};
