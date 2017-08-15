# Polyfills!

The polyfills contained in this folder can be imported as necessary. They should
export either the builtin native function(s), if found on the global, or the
polyfill itself.

## Usage

**In code**

```js
const Promise = require('bv-ui-core/lib/polyfills/promise')
// Do things with the Promise polyfill!
const myPromise = new Promise((resolve, reject) => {/*...*/})
```

```js
const { fetch, Headers } = require('bv-ui-core/lib/polyfills/fetch')
// Do things with the fetch polyfill!
fetch(url, {
  headers: new Headers({
    'Accept': 'application/json',
  }),
}).then(myCallback)
```

**In webpack**

```js
plugins: [
  // Any references to these items in the bundle will be wrapped in
  // references to their respective polyfill module exports.
  new webpack.ProvidePlugin({
    Promise: 'bv-ui-core/lib/polyfill/promise',
    fetch: ['bv-ui-core/lib/polyfill/fetch', 'fetch'],
    Headers: ['bv-ui-core/lib/polyfill/fetch', 'Headers'],
  })
]
```