# checkHighContrast

This is a small method to do the somewhat complicated job of figuring out
whether a browser is operating in high contrast mode. This works on all
windows browsers but only firefox on mac. The end goal is to be able to style
the page differently so these users.

## Usage
```javascript
var checkHighContrast = require('checkHighContrast');

if( checkHighContrast(body) ) {
... setup alternate styles ...
}
```
