# Polyfills!

The polyfills contained in this folder can be imported as necessary. They should
export either the built-in being polyfilled, if found on the global, or the
polyfill.

## Usage

**In code**

```js
const Promise = require('bv-ui-core/lib/polyfills/promise')
// Do things with the Promise polyfill!
const myPromise = new Promise((resolve, reject) => {/*...*/})
```

**In webpack**

```js
plugins: [
  new webpack.ProvidePlugin({
    // Any Promise references in the bundle will be wrapped in references to
    // the polyfill.
    Promise: 'bv-ui-core/lib/polyfill/promise'
  })
]
```