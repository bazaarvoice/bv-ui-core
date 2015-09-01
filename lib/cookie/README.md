# cookie

The cookie module provides methods for interacting with browser cookies.

```js
var cookie = require('bv-ui-core/lib/cookie');

cookie.write('RememberMe', '1', 365);
console.log(cookie.read('RememberMe')); // '1'
cookie.remove('RememberMe');
```

The following methods are provided:

- `read(name)`: Read the cookie with the given name.
- `create(name, value, [days, domain, secure])`: Write a cookie with the given
  name and value. Set the expiration in days using the `days` argument; set
  the domain using the `domain` argument; indicate that the cookie is secure
  by passing `true` as the `secure` argument. Note that if one optional
  argument is provided, all previous arguments must be provided as well.
- `remove(name)`: Delete the cookie with the given name.
