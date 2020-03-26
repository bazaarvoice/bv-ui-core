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

By default, any errors thrown from an event listener are caught and simply logged to the console.
An alternate behavior can be specified by providing an event handler:

```js
var model = new Model({});

model.setErrorHandler(function(error, trigger) {
  // error is the value that was thrown, typically an instance of Error
  // trigger.event is the name of the event passed to trigger()
  // trigger.data is an array containing the additional arguments passed to trigger()
});

// If you prefer for errors to be thrown from trigger(), then use:
model.setErrorHandler(function(error) { throw error; });
```

[1]: https://github.com/mkuklis/asEvented
