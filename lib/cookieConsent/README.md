# cookieConsent

The cookieConsent module provides methods for controlling cookie consents.

```js
var cookieConsent = require('bv-ui-core/lib/cookieConsent');
// Initialize
/**
 * 2nd parameter is to disable/enable consent mechanism.
 * Passing true will disable the consent mechanism.
*/
cookieConsent.initConsent({
  cookie1: false,
  cookie2: true
}, false);

// Set cookie consent
cookieConsent.setConsent({ cookie1: true });

// Get cookie consent
cookieConsent.getConsent('cookie1');

// Subscribe to consent 'add' event. Triggers when a new cookie consent is added
cookieConsent.subscribe('cookie3', 'add', function (data) {});

// Subscribe to consent 'enable' event. Triggers when a cookie consent is set to true
cookieConsent.subscribe('cookie3', 'enable', function (data) {});

// Valid events that can be subscribed to are 'add', 'enable', 'disable', and 'change'
// Subscribe to consent 'disable' event. Triggers when a cookie consent is set to false
var event = cookieConsent.subscribe('cookie3', 'disable', function (data) {});

// Subscribe to the store change event. The latest consent store object is passed as parameter to the callback function
var event = subscribeToConsentStore(function (store){});

// Unsubscribe events
event.unsubscribe();

// Get cookie consent disabled/enabled value.
cookieConsent.getConsentDisabled();
```