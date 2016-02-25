# CSS Load Checker

This module provides a means of checking if a CSS file has been loaded already or not. It does this by adding a test div to the page and checking the computed styles of it for the `display: none` style.

```js
var cssLoadChecker = require('bv-ui-core/lib/cssLoadChecker');

if (cssLoadChecker.isCssLoaded('bv-verify-css-loaded')) {
  // do stuff if loaded
}
else {
  // do stuff if not loaded (like load it)
  loader.loadStyleSheet(namespace.cssUrl, callback);
}
```

The following methods are provided:

- `isCssLoaded(className)`: Loads a test div onto the page with the given class name and checks for the style `display: none`. If this is set, then the CSS file is assumed to be present so it returns true. Otherwise, it returns false. The test div is removed before this function finishes executing.
