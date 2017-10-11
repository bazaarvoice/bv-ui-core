/**
 * Check for the existence of a builtin fetch function, and return it if it
 * exists. Otherwise, load whatwg-fetch in a non-globally-polluting way. It
 * checks for the existence of a 'self' variable to attach itself to, and
 * otherwise, will attach itself to the global object. Because of that, create
 * a global.self reference for it to attach to, caching any preexisting value,
 * and restoring the preexisting value after load, exporting the polyfill (and
 * its supporting data types) from this module.
 *
 * In the case of an existing builtin fetch, return it and its supporting data
 * types from this module, so that any module that needs fetch or its supporting
 * data types can import all of them from here, whether they're preexisting or
 * not.
 */
var global = require('../global')

// If fetch is unsupported, or is currently polyfilled, supply our own, just in case
if (typeof global.fetch === 'undefined' || !global.fetch.toString().match(/\[native code]/)) {
  // Cache any preexisting value
  var self = global.self;

  // Create a new version of 'self', complete with things
  // whatwg-fetch does some internal support checks for.
  global.self = {};

  // whatwg-fetch uses 'in' checks which breaks on undefined properties, so we
  // should check for existence and only add the ones that we know we have.
  var names = ['URLSearchParams', 'FileReader', 'Blob', 'FormData', 'ArrayBuffer'];
  names.forEach(function (name) {
    if (global[name]) {
      global.self[name] = global[name];
    }
  });

  // Require whatwg-fetch, which will search for 'self' and attach to it.
  require('whatwg-fetch');

  // Export the polyfilled items that were housed in the global.self namespace.
  // fetch itself should be the default export, but we need to also make sure
  // that we export the other items for destructuring in case they're needed.
  Object.defineProperties(global.self.fetch, {
    fetch: {
      enumerable: true,
      writable: false,
      value: global.self.fetch,
    },
    Headers: {
      enumerable: true,
      writable: false,
      value: global.self.Headers,
    },
    Request: {
      enumerable: true,
      writable: false,
      value: global.self.Request,
    },
    Response: {
      enumerable: true,
      writable: false,
      value: global.self.Response,
    }
  });

  module.exports = global.self.fetch;

  // Restore the original value of 'self' to the version we cached at the top.
  global.self = self;
}
else {
  // fetch is natively supported, export it and its support constructors.
  // fetch itself should be the default export, but we need to also make sure
  // that we export the other items for destructuring in case they're needed.
  Object.defineProperties(global.fetch, {
    fetch: {
      enumerable: true,
      writable: false,
      value: global.fetch,
    },
    Headers: {
      enumerable: true,
      writable: false,
      value: global.Headers,
    },
    Request: {
      enumerable: true,
      writable: false,
      value: global.Request,
    },
    Response: {
      enumerable: true,
      writable: false,
      value: global.Response,
    }
  });

  module.exports = global.fetch;
}
