# Body

This is a shorthand method for accessing the <body> element within the document. Not only is it shorter, it returns the current body of the current context. Also useful in non-browser environments by overloading the function to return an appropriate element.

## Usage
```javascript
var body = require('body');

var body = body();
```