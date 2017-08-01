# getOriginalConstructor

This file exposes a utility function to get a reset version of a primitive
constructor, in the event that a client has overridden or polyfilled prototype
methods in their own primitives, or used a utility like Prototype.js, which
does that on its own.

## Usage
```javascript
var getOriginalConstructor = require('getOriginalConstructor');

getOriginalConstructor(Array).prototype.forEach(someNodeList, callback);
```
