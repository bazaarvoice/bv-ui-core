# namespacer

The namespacer module provides an interface to create or obtain a namespace
suitable for use by one or more applications running on the same web page.

```js
var global = require('bv-ui-core/lib/global');
var namespacer = require('bv-ui-core/lib/namespacer');

// If the namespace already exists it will be returned. If not it will be
// created and then returned.
var namespaceName = 'EXAMPLE';
var namespace = namespacer.namespace(namespaceName);

// The namespace also exists on the global object once created.
namespace = global[namespaceName];
```

## Namespace API

A namespace instance exposes the following methods:

### registerProperty (name, value)

A namespace instance allows for registration of properties to identify unwanted
collisions. Typically one or more applications will register themselves with the
namespace on a given web page, but there are also other situations in which
registration of properties is useful.

```js
namespace.registerProperty('example', applicationInstance);

// The application is now assigned to namespace.example.
var exampleApplication = namespace.example;

// Trying to register another value to 'example' in this namespace will throw.
try {
  namespace.registerProperty('example', anotherApplicationInstance);
}
catch (e) {
  console.error(e);
}
```

## Creating a `namespace` Module

It is good practice for an application to create a `namespace` module that
exports the namespace used by that application. For example:

```js
var namespacer = require('bv-ui-core/lib/namespacer');

module.exports = namespacer.namespace('EXAMPLE');
```

All other code can then require the `namespace` module when access to the
namespace is needed.
