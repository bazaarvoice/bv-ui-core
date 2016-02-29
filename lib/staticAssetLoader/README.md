# Static Asset Loader

This can be used by client-side web applications to request and receive the
static resources they require from a suitable static asset server. The
primary objective is to allow multiple discrete web applications on the same
page to converge on shared dependencies. Each dependency is only loaded
once and this reduces the overall page footprint.

## Basic Usage

### Configuration

The static asset loader must be configured with the following:

  * A function to generate asset URLs from asset name and version strings.
  * The name of the application namespace.

Applications sharing static assets must use the same namespace.

```javascript
var staticAssetLoaderFactory = require('bv-ui-core/lib/staticAssetLoader');

var staticAssetLoader = staticAssetLoaderFactory.create({
  /**
   * Convert one or more asset strings into a static asset service URL.
   *
   * The details depend on the static asset server capabilities. This is an
   * example implementation for a server capable of delivering asset bundles.
   *
   * @param {String[]} An array of asset names and version: ['jQuery@2.0.0'].
   * @return {String} The URL for the asset.
   */
  generateUrl: function (assetNames, namespaceName) {
    var filename = encodeURIComponent(assetNames.slice(0).sort().join('+')) + '.js';

    namespaceName = encodeURIComponent(namespaceName);
    return 'https://static.example.com/1/asset/' + namespaceName + '/' + filename;
  },

  /**
   * Provide the name of a namespace to hold the _staticAssetRegistry properties
   * and methods. Applications sharing static assets must use the same
   * namespace.
   */
  namespaceName: 'EXAMPLE'
});
```

### Require Assets

When the application requires a resource of a supported type, use the client to
request that resource via the `require` method.

```javascript
// Request the desired assets. For example:
staticAssetLoader.require([
  'underscore@1.0.0',
  'jquery-custom@1.11.1',
  'backbone@1.2.0'
], function (_, $, Backbone) {
  // This callback will be invoked when all of the required assets have been
  // resolved.
});
```

Note that when requesting an asset that has dependency assets - for example,
Backbone depends on jQuery and either Underscore or Lodash - it is necessary to
request those dependencies in the same `require` call.

### Define Assets

Applications that ship with resources that might be useful to other applications
on the page can provide those resources via the static asset loader. This again
allows for a convergence of dependencies and reduced page weight.

```javascript
// After definition, staticAssetLoader.require('jquery-custom@1.11.1', callback)
// will call back immediately with the provided instance of jQuery.
staticAssetLoader.define('jquery-custom@1.11.1', jQuery);
```

### Order and Timing of Calls

Calls to `require` and `define` can be made in any order and at any time, for so
long as each call to `require` includes all needed dependency assets. Obviously
it is usually better to make these calls as early as possible in the application
initialization process so as to minimize lead time.

## Form of the Static Asset Service

The static assert service is a web service that can respond to requests such as:

`https://static.example.com/1/asset/namespace/jquery@1.11.1.js`

Importantly, the static asset service must be capable of serving bundles of
assets in response to a single request, with the assets listed in alphabetical
order. E.g.:

`https://static.example.com/1/asset/namespace/backbone@1.2.0+jquery@1.11.1.js`

The returned Javascript must both define the assets themselves and then provide
the asset to the static asset client in the same way as described above. For
example:

```javascript
(function (define) {

  // Asset source code goes here.
  //
  // ...

  // Then provide the asset or assets to the client.
  define('asset@1.0.0', asset);

}(window[namespace]._staticAssetRegistry.define));
```
