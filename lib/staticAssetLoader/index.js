/**
 * @fileOverview
 * A static asset loader to pull resources at particular versions from a static
 * asset service. This could be as simple as an S3-backed CDN, or a webserver
 * serving from a directory of files. E.g. a server that can respond to requests
 * such as:
 *
 * https://static.example.com/1/asset/jquery@1.11.1.js
 *
 * Importantly, the static asset service must be capable of serving bundles of
 * assets in a single request, where these assets are listed in alphabetical
 * order. E.g.:
 *
 * https://static.example.com/1/asset/backbone@1.2.0+jquery@1.11.1.js
 *
 * This is primarily intended to reduce asset duplication among multiple
 * distinct client applications running on the same page.
 *
 * The returned Javascript must both define the assets themselves and then
 * provide the asset to the static asset client. For example:
 *
 * (function (define) {
 *
 *   // Asset source code goes here.
 *   //
 *   // ...
 *
 *   // Then provide the asset or assets to the client.
 *   define('asset@1.0.0', ['dependency@1.0.0'], asset);
 *
 * }(window[namespace]._staticAssetRegistry.define));
 */

var loader = require('../loader');
var namespacer = require('../namespacer');

/**
 * Invoke the provided function on each element of the array.
 *
 * @param {Array} arr An array.
 * @param {Function} fn Function to invoke as fn(element, index, array).
 */
function forEach (arr, fn) {
  if (!arr || !arr.length) {
    return;
  }

  for (var index = 0; index < arr.length; index++) {
    fn(arr[index], index, arr);
  }
}

/**
 * Create a new array containing the results of applying the provided function
 * to each element.
 *
 * @param {Array} arr An array.
 * @param {Function} fn Function to invoke as fn(element, index, array).
 * @return {Array} The mapped array.
 */
function map (arr, fn) {
  var mappedArray = [];

  forEach(arr, function (val, index, originalArray) {
    mappedArray.push(fn(val, index, originalArray));
  });

  return mappedArray;
}

module.exports = {
  /**
   * A factory function for static asset loaders.
   *
   * See the documentation for the properties required for the configuration
   * object.
   *
   * @param {Object} config Configuration.
   * @return {Object} A static asset loader instance.
   */
  create: function staticAssetLoaderFactory (config) {
    var generateUrl = config.generateUrl;
    var namespaceName = config.namespaceName;

    if (!namespaceName) {
      throw new Error('Cannot initialize staticAssetLoader without a namespace name.');
    }

    if (typeof generateUrl !== 'function') {
      throw new Error('Cannot initialize staticAssetLoader without a URL generation function.');
    }

    // TODO: think about allowing some of the loader options to be set via the
    // static asset loader config object.
    var loaderOptions = config.loaderOptions || {};
    var NS = namespacer.namespace(namespaceName);
    var registry = NS._staticAssetRegistry = NS._staticAssetRegistry || {
      // Stores defined entities by asset name. E.g.:
      //
      // {
      //   'jquery@1.11.1': jquery,
      //   ...
      // }
      assets: {},
      // Stores requests indexed by included asset, each of which can specify
      // multiple assets. Has the form:
      //
      // {
      //   'jquery@1.11.1': {
      //     assetNames: ['jquery@1.11.1', ...],
      //     callback: function (jQuery, ...),
      //     complete: false
      //   },
      //   ...
      // }
      requests: {},
      // Set below to the _define function, so that loaded asset wrappers can
      // use it to define assets.
      define: undefined
    };

    /**
     * Given a request object, call back with the list of requested assets, in
     * the same order as requested, if all assets are defined and the callback
     * has not already occurred.
     *
     * @param {Object} request
     */
    function callbackIfComplete (request) {
      // Already called back?
      if (request.complete) {
        return;
      }

      var complete = true;
      var assets = map(request.assetNames, function (assetName) {
        var asset = registry.assets[assetName];

        if (!asset) {
          complete = false;
        }

        return asset;
      });

      if (complete) {
        request.complete = true;
        if (typeof request.callback === 'function') {
          request.callback.apply(null, assets);
        }
      }
    }

    /**
     * Define assets. Usage is:
     *
     * _define('x@1.0.0', x);
     *
     * Later calls to _require() for this asset name will yield the defined
     * asset.
     *
     * Any currently pending calls to _require() now satisfied will resolve.
     *
     * @param {String} assetName The name of the asset. E.g. 'jquery@1.11.1'.
     * @param {Mixed} asset The asset.
     */
    function _define (assetName, asset) {
      // Ignore an attempt to redefine an asset. This can cause potentially
      // interesting problems when some references point to instance A and
      // others to instance B.
      if (registry.assets[assetName]) {
        return;
      }

      registry.assets[assetName] = asset;
      forEach(registry.requests[assetName], callbackIfComplete);
    }

    /**
     * Require assets and provide a callback to be invoked when the assets are
     * resolved.
     *
     * @param {String[]} assetNames An array of supported asset names.
     * @param {Function} callback The callback to be called when the assets are
     *   resolved, with the assets as its arguments in the same order as the
     *   provided assets array.
     */
    function _require (assetNames, callback) {
      var request = {
        assetNames: assetNames,
        callback: callback,
        complete: false
      };

      forEach(assetNames, function (assetName) {
        registry.requests[assetName] = registry.requests[assetName] || [];
        registry.requests[assetName].push(request);
      });

      // Are all the dependencies already in place, and so we can skip the
      // loading of assets?
      callbackIfComplete(request);
      if (request.complete) {
        return;
      }

      var assetNamesToBeRequested = [];

      forEach(assetNames, function (assetName) {
        // The asset already exists.
        if (registry.assets[assetName]) {
          return;
        }
        // There is already a pending request for this asset. So don't issue
        // another request, just ensure that a response is delivered to this
        // request when the pending request completes.
        else if (registry.requests[assetName].length > 1) {
          return;
        }
        // There is no pending request; we need to queue it for requesting.
        else {
          assetNamesToBeRequested.push(assetName);
        }
      });

      // If we queued any requests, now we need to make them.
      if (assetNamesToBeRequested.length) {
        loader.loadScript(
          generateUrl(assetNamesToBeRequested, namespaceName),
          loaderOptions,
          function (error) {
            if (error) {
              throw new Error(
                'Failed to load ' + assetNamesToBeRequested.join(', ') + ': ' + error.toString());
            }
          }
        );
      }
    }

    // This is made available for responses from the static asset server to use.
    registry.define = _define;

    // Return the static asset loader interface.
    return {
      require: _require,
      define: _define
    };
  }
};
