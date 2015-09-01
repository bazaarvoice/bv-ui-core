# Date.now

Uses `Date.now` when available and falls back to `new Date().getTime()` when
needed to get the number of milliseconds elapsed since 1 Jan 1970 00:00:00 UTC.

## Usage
```javascript
var date = require('date.now');

var now = date.now();
```
