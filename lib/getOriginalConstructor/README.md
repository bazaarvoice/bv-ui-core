# getOriginalConstructor

This file exposes a utility function to get a reset version of a primitive
constructor, in the event that a site has overridden or polyfilled prototype
methods in their own primitives, or used a utility like Prototype.js, which
does that on its own. It returns a Promise that will be resolved with the original primitive constructor.

## Usage
```javascript
var getOriginalConstructor = require('bv-ui-core/lib/getOriginalConstructor');

getOriginalConstructor(Array).then(function (originalArray) {
  originalArray.prototype.forEach(someNodeList, callback);
});
```
