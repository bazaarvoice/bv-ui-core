# cookie

The cookie module provides methods for interacting with browser cookies.

```js
var cookie = require('bv-ui-core/lib/cookie');

cookie.create('RememberMe', '1', 365);
console.log(cookie.read('RememberMe')); // '1'
cookie.remove('RememberMe');
```

## The following methods are provided:

- `read(name)`: Read the cookie with the given name.
- `create(name, value, [days, domain, secure])`: Write a cookie with the given
  name and value. Set the expiration in days using the `days` argument; set
  the domain using the `domain` argument; indicate that the cookie is secure
  by passing `true` as the `secure` argument. Note that if one optional
  argument is provided, all previous arguments must be provided as well.
- `remove(name)`: Delete the cookie with the given name.

## Usage with `cookieConsent`:

- Call `cookieConsent.initConsent` before calling `cookie.create`.
- Cookies will get created only if the consent for that cookie is true.
- Each cookie will automatically subscribe to `enable` and `disable` consent events for that cookie.
- Cookie will get set when consent is `true`.
- Cookie will get removed when consent is `false`.
