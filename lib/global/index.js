/**
 *  @fileOverview Provides a reference to the global object
 *  the below solution works in ES3+ environment and doesn't violates CSP in Chrome apps 
 *  see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
 */
'use strict'; /* eslint strict:0 */

var getGlobal = function () {
  var globalObj = (function () {
    if (typeof globalThis !== 'undefined') { return globalThis; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof self !== 'undefined') { return self; }
    if (typeof global !== 'undefined') { return global; }
    throw new Error('unable to locate global object');
  })()
  /*
    The below code was added in case there is pollution in global namespace
    windows object during transpilation with __esModule being set. Below code would support
    global import in all bundle use cases
  */
  if (globalObj && globalObj.__esModule) {
    const override = {
      get: function (target, prop, receiver) {
        if (prop === 'default') {
          return target
        }

        return Reflect.get(receiver, prop, target)
      },

      set: function (target, prop, value, receiver) {
        Reflect.set(target, prop, value, receiver)
        return true
      },
    };
    const proxyGlobal = new Proxy(globalObj, override)
    return proxyGlobal
  }
  return globalObj
};

module.exports = getGlobal();
