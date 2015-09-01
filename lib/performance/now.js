/**
 *  @fileOverview Provides a cross-browser safe way to use the Navigation Timing API
 *  Ported from Firebird's scout directory
 *  Based on https://gist.github.com/paulirish/5438650
 *
 *  Note: this is not a true polyfill in browsers that do not implement the
 *  Navigation Timing API.  Rather than returning the time elapsed since
 *  `navigationStart`, it will return the time elapsed since the polyfill was
 *  installed.
 *
 *  Further reading:
 *  http://www.w3.org/TR/user-timing/
 *  http://caniuse.com/#search=User%20Timing
 *  http://caniuse.com/#search=performance.now
 *  http://caniuse.com/#search=Navigation%20Timing
 */

// Imports
var global = require('../global');
var dateNow = require('../date.now');

// Cache references for speed and to guard against shenanigans
var performance = global.performance;
var nativeNow = performance && performance.now;

// Is the Navigation Timing API natively supported?
var isNativeSupported = (typeof nativeNow === 'function');

// Used by the polyfill implementation to get the moment the module was installed
var nowOffset = dateNow.now();

// Use navigationStart as the offset when possible
if (performance &&
  performance.timing &&
  typeof performance.timing.navigationStart === 'number'
) {
  // Use navigationStart value instead
  nowOffset = performance.timing.navigationStart;
}

/**
 *  Native Implementation
 *  Uses the natively-supported performance.now function
 */
function nativeImplementation () {
  return nativeNow.call(performance);
}

/**
 * Polyfill Implementation
 * Provides similar functionality to performance.now but instead uses a default
 * offset of the moment the polyfill was installed
 */
function polyfillImplementation () {
  return dateNow.now() - nowOffset;
}

module.exports = {
  now: function () {
    var func = (isNativeSupported) ? nativeImplementation : polyfillImplementation;
    return func();
  }
};
