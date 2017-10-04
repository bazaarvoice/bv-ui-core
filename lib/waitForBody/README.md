# waitForBody

This file exposes a utility function that will invoke its callback once the
`document.body` tag has been created by the runtime environment. It is
intended to be used in the case of scripts that execute synchronously in the
head of a document, prior to document.body being available, yet having a
dependency on document.body for some reason (e.g. appending DOM nodes). This
function uses a MutationObserver in order to function, so requires that level
of support in order to function.

## Usage
```javascript
var waitForBody = require('bv-ui-core/lib/waitForBody');

var div = document.createElement('div');
div.id = 'modalContainer';

waitForBody(function () {
  document.body.appendChild(div);
});
```
