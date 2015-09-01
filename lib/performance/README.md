# Performance

Provides a cross-browser safe way to use the Navigation Timing API.

## Performance/now

Ported from Bazaarvoice internal code and based on [a Paul Irish polyfill][1].

### Usage

```javascript
var perfNow = require('performance/now.js');

var timing = perfNow.now();
```

### Notes

This is not a true polyfill in browsers that do not implement the Navigation
Timing API. Rather than returning the time elapsed since `navigationStart`, it
will return the time elapsed since the polyfill was installed.

## Performance/mark

Also ported from Bazaarvoice internal code.

### Usage

```javascript
var perfMark = require('performance/mark.js');

perfMark.mark('mark-name');
```

[1]: https://gist.github.com/paulirish/5438650
