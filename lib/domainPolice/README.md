# domainPolice

The `domainPolice` module provides a simple mechanism to take in an array of objects that represent a known whitelist of domains, as well as a particular URL, and provides information as to whether that domain is an authorized domain, as well as information regarding third-party cookie authorization.

## Methods

There are two methods on the `domainPolice` module:

 - `allowedDomain`: Returns the matching domain from the whitelist, or `undefined` otherwise.
 - `thirdPartyCookieEnabled`: Returns `true` if the domain is found and set to allow third-party cookies, or `false` otherwise.

Both of these methods take the same two arguments:

 - `url`: The particular URL to be validated as a string.
 - `allowedDomains`: An array of objects representing whitelisted arrays.

### `allowedDomains` format

For both methods, the `allowedDomains` argument is expected to be an array of objects, and each object is expected to have a `domainAddress` property, as well as a `thirdPartyCookieEnabled` property. Here's an example, from the unit tests:

```javascript
var allowedDomains = [
  {
    domainAddress : '.bazaarvoice.com',
    thirdPartyCookieEnabled : true
  },
  {
    domainAddress : '.localhost',
    thirdPartyCookieEnabled : false
  },
  {
    domainAddress : 'no-prefixing-dot.foo.com',
    thirdPartyCookieEnabled : true
  }
];
```

The prefixing `.` on the `domainAddress` will open it up to authorize all subdomains as well. Given the above example, the following domains are all allowed:

- `bazaarvoice.com`
- `subdomain.bazaarvoice.com`
- `localhost`
- `www-stg.localhost`
- `no-prefixing-dot.foo.com`

Domains that would not be allowed:

- `foo.com`
- `something.foo.com`
- `bazaarvoice.co.jp`
