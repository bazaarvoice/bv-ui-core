# domainPolice

The `domainPolice` module provides a function that takes a hostname and an array of
objects representing a known whitelist of domains, and returns an object with a
simple API, representing the state of that URL in the whitelist.

## Module arguments

 - `hostname`: The particular hostname to be validated as a string. Ports and protocols are not validated and should not be supplied as part of this. Optimally, this should be provided from `window.location.hostname` in the browser.
 - `allowedDomains`: An array of objects representing whitelisted arrays.

## Usage

```javascript
var domainPolice = require('bv-ui-core/lib/domainPolice');

var allowedDomains = [
  {
    domain: '.bazaarvoice.com',
    thirdPartyCookieEnabled: true
  },
  {
    domain: '.localhost',
    thirdPartyCookieEnabled: false,
    commentsEnabled: true,
  },
  {
    domain: 'no-prefixing-dot.foo.com',
    commentsEnabled: true
  }
];

var bvCop = domainPolice(allowedDomains, 'www.bazaarvoice.com');
bvCop.isValid; // => true
bvCop.get('domain'); // => '.bazaarvoice.com'
bvCop.get('thirdPartyCookieEnabled'); // => true
bvCop.get('commentsEnabled'); // => undefined

var nopeCop = domainPolice(allowedDomains, 'ww.w.foo.com');
nopeCop.isValid; // => false
nopeCop.get('anything'); // => undefined
```

### `allowedDomains` format

`allowedDomains` is an array of objects, and each object is expected to have a
`domain` property. It may also contain any other arbitrary properties as desired
for later lookup.

Prefixing `.` on the `domain` will allow it to match all subdomains as well.
URL hosts which include `www.` will be allowed with domain name match.

Given the above example, the following domains are all valid:

- `bazaarvoice.com`
- `subdomain.bazaarvoice.com`
- `localhost`
- `www-stg.localhost`
- `no-prefixing-dot.foo.com`
- `www.no-prefixing-dot.foo.com`

Domains that would not be allowed:

- `foo.com`
- `something.foo.com`
- `bazaarvoice.co.jp`
