# parseUri

This utility simply allows for the parsing of various pieces out of a URI provided to it. It was originally sourced from [blog.stevenlevithan.com](http://blog.stevenlevithan.com/archives/parseuri) for Firebird some years ago.

## Usage

```javascript
var parseUri = require('bv-ui-core/lib/util/parseUri');
var url = 'http://some.example.com';

var parsedUri = parseUri(url);
```

The resulting `parsedUri` object in the above example would have several properties representing the various parts of the provided URI. Rather than list each one, here's a simple example that details the parts you can expect to receive.

Given the following URL:
`https://bob:smith@subdomain.example.com:8080/path/to/file.html?foo=bar&baz=3#hash`

The resulting object will look something like this:

```javascript
{
  anchor: 'hash',
  query: 'foo=bar&baz=3',
  file: 'file.html',
  directory: '/path/to/'
  path: '/path/to/file.html',
  relative: '/path/to/file.html?foo=bar&baz=3#hash',
  port: '8080',
  host: 'subdomain.example.com',
  password: 'smith',
  user: 'bob',
  userInfo: 'bob:smith',
  authority: 'bob:smith@subdomain.example.com:8080',
  protocol: 'https',
  source: 'https://bob:smith@subdomain.example.com:8080/path/to/file.html?foo=bar&baz=3#hash',
  queryKey: {
    foo: 'bar',
    baz: '3'
  }
}
```

Of special note is the `queryKey` property, which gives you a simple object-style key/value pair of the query string parameters.
