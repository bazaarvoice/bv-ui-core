# ie

The ie module provides the version of IE in which the scout is running, if the
browser is IE and the version is less than or equal to 9. In other cases, the
value provided by the module is false.

```js
var ie = require('bv-ui-core/lib/ie');

if (!ie) {
  // Thank goodness.
}
```
