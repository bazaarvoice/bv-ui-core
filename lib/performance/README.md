# Performance

Provides a cross-browser safe way to use the Navigation Timing API.

## Performance/now

Ported from Firebird's scout directory, and based on https://gist.github.com/paulirish/5438650

### Usage
```javascript
var perfNow = require('performance/now.js');
 
var timing = perfNow.now();
```

### Notes
This is not a true polyfill in browsers that do not implement the Navigation Timing API.  Rather than returning the time elapsed since `navigationStart`, it will return the time elapsed since the polyfill was installed.

## Performance/mark

Ported from Firebird's scout directory

### Usage
```javascript
var perfMark = require('performance/mark.js');
 
perfMark.mark('mark-name');
```