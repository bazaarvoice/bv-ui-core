# loader

The loader module provides the following methods:

- `loadScript(url, [options], [callback])`: Loads the script at the provided
  URL in a non-blocking manner, and executes a Node-style callback (if
  provided) when the script is loaded or fails to load. Also returns a promise
  that will be resolved if the script loads, and rejected if it does not. A
  `timeout` value in milliseconds can be provided via the `options` argument.
- `loadStyleSheet(url, [options], [callback])`: Loads the CSS at the provided
  URL in a non-blocking manner, and executes a Node-style callback (if
  provided) when the CSS is loaded or fails to load. Also returns a promise
  that will be resolved if the CSS loads, and rejected if it does not. A
  `timeout` value in milliseconds can be provided via the `options` argument.

```js
var loader = require('bv-ui-core/lib/loader');

var promise = loader.loadScript('/scripts/main.js', function (err, cb) {
  console.log('it worked');
});

promise.then(function () {
  console.log('it really worked');
});
```

Note: Failure to load is *not* reliably detected in older versions of IE. For
both `loadScript` and `loadStyleSheet`, the callback will not be executed on
failure in old IE, and the returned promise will not be rejected on failure in
old IE.

### loadScript options

- **attributes**: an object containing key/value pairs to be used as
attributes on the created `<script>` element.
- **timeout**: the time in milliseconds before the loading should be
considered failed. Defaults to 10000ms.

### loadStyleSheet options

- **attributes**: an object containing key/value pairs to be used as
attributes on the created `<link>` element.
- **injectionNode**: a DOM node into which the `<link>` element should be
placed. The default insertion point is after the first `<script>` element on the page.
- **timeout**: the time in milliseconds before the loading should be
considered failed. Defaults to 10000ms.

### loader timeout

The loader module provides an extensible timeout that will invoke the provided
callback with an error. In certain remote testing environments, the default
timeout may not be sufficient for an initial page load. If you experience
timeout errors when using the loader module you should experiment with raising
this timeout using the provided `option.timeout`.

```js
var loader = require('bv-ui-core/lib/loader');

var options =  {
  timeout : 30000
}

loader.loadScript('/scripts/main.js', options, function (err, cb) {
  if (err) {
    console.log('We may have timed out :(');
  }
});
```
