# evented

Based on [asEvented][1], the evented module provides a function that can be
called on a constructor in order to make instances act as event emitters.

```js
var evented = require('bv-ui-core/lib/evented');

function Model(config) {
  this.config = config;
};

evented.call(Model.prototype);
```

An event emitter provides the following methods:

- `on(event, fn)`
- `off(event, fn)`
- `one(event, fn)`
- `once(event, fn)`
- `trigger(event, *data)`

[1]: https://github.com/mkuklis/asEvented
