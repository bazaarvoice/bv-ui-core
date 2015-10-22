# logger

The `logger` module provides an object that wraps various console logging methods safely. The default level is INFO, but it is recommended that you set this according to your environment.

## Usage

```javascript
var Logger = require('bv-ui-core/lib/logger');
// <method> is one of the 5 types, ex: log
Logger.<method>('Hello, world!') // console.log('Hello, world!')
```


## Other Methods
### Logger.setLogLevel

Set the log level to one of the following to prevent logging under the specified level.
```
Logger.DEBUG
Logger.LOG
Logger.INFO
Logger.WARN
Logger.ERROR
Logger.OFF
```

```javascript
var Logger = require('bv-ui-core/lib/logger');

// Set's the default log level to one of the valid levels
// DEBUG, LOG, INFO, WARN, ERROR, OFF
Logger.setLogLevel(Logger.DEBUG)

Logger.log('Hello, World!') // Prints Hello, World!

Logger.setLogLevel(Logger.INFO)

Logger.log('Hello, World!') // Prints nothing because of logLevel
```

### Logger.group/Logger.groupEnd
https://developer.mozilla.org/en-US/docs/Web/API/console/group

### Logger.time/Logger.timeEnd
https://developer.mozilla.org/en-US/docs/Web/API/console/time

### Logger.assert

Assertions can be made if `logLevel` is not `Logger.OFF`. You can assert a function's result or a boolean value.

```javascript
Logger.assert(() => {
  return false;
  }, 'The function failed!'
);

Logger.assert(true === false, 'Obviously, I failed.');
```

