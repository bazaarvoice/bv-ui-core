# application

The application module provides an Application class that provides methods to
queue your users' calls until the actual code to support those calls is
present.

For example, your user may expect to be able to ask your application to render
immediately after this initial application module is loaded, even though the
code to perform the rendering has not yet loaded.

The application module is typically used in conjunction with the
[loader][1] module, [namespacer][2] module, and some configuration data, as
shown here. Once you create an application instance, it is good practice to add
it as a property to a namespace:

```js
var Application = require('bv-ui-core/lib/application');
var loader = require('bv-ui-core/lib/loader');
var namespacer = require('bv-ui-core/lib/namespacer');
var config = require('json!config.json');

// Creates a namespace at window.APP and an application object at
// window.APP.exampleApp. The config object will be available at
// window.APP.exampleApp.config.
namespacer.namespace('APP').registerProperty(
  'exampleApp',
  new Application(config)
);

// Now load following code.
// loader.load(url).then( ... do something ... );
```

## Methods to be Called by Users

An application instance provides the following methods:

- `render(config)`: A method intended for your users to call any time after
  this application module is loaded, passing in configuration information
  related to a request to render your application.

```js
APP.exampleApp.render({ productId : 1 });
```

- `configure(config)`: A method intended for your users to call any time after
  the application code is loaded, passing in general configuration information
  not necessarily related to rendering.

## Methods to Be Called by Core Application Code

- `processQueue(fn)`: A method that your core application code can call in
  order to access calls to `render` that have occurred; the provided function
  will be used to handle those calls, and will then replace the original
  definition of the `render` method. Queued items are processed on the next
  tick.
- `processConfig(fn)`: A method that your core application code can call in
  order to access calls to `configure` that have occurred; the provided
  function will be used to handle those calls, and will then replace the
  original definition of the `configure` method. Queued items are processed
  synchronously, as they are not expected to have any DOM implications.

[1]: ../loader
[2]: ../namespacer
