# cookieConsent

The cookieConsent module provides methods for controlling cookie consents.

```js
var cookieConsent = require('bv-ui-core/lib/cookieConsent');
// Initialize
cookieConsent.initConsent({
  cookie1: false,
  cookie2: true
});

// Set cookie consent
cookieConsent.setConsent('cookie1', true);

// Get cookie consent
cookieConsent.getConsent('cookie1');

// Subscribe to consent 'add' event. Triggers when a new cookie consent is added
cookieConsent.subscribe('cookie3', 'add', function (data) {});

// Subscribe to consent 'enable' event. Triggers when a cookie consent is set to true
cookieConsent.subscribe('cookie3', 'enable', function (data) {});

// Subscribe to consent 'disable' event. Triggers when a cookie consent is set to false
var event = cookieConsent.subscribe('cookie3', 'disable', function (data) {});

// Unsubscribe events
event.unsubscribe();
```