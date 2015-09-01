# parseUri

This utility parses a URI and returns an object that provides various parts of
the URI. It is an adaptation of code published on [blog.stevenlevithan.com][1].

## Usage

```javascript
var parseUri = require('bv-ui-core/lib/parseUri');
var url = 'http://some.example.com';

var parsedUri = parseUri(url);
```

The resulting `parsedUri` object in the above example has properties that
represent the various parts of the provided URI.

Given the following URL:

`https://bob:smith@subdomain.example.com:8080/path/to/file.html?foo=bar&baz=3#hash`

The resulting object will be equivalent to this:

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

Of special note is the `queryKey` property; it provides a simple key/value
representation of the query string parameters.

[1]: http://blog.stevenlevithan.com/archives/parseuri
