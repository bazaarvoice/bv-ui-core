# logger

The `logger` module provides an object that wraps various console logging methods safely. The default level is OFF, but it is recommended that you set this according to your environment either at build time or by a cookie in the browser in the format `_bvui_debug=loglevel:1`.

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

If you have set the logLevel via cookie, any calls to `setLogLevel` in your application will be ignored unless you also pass a force param.

```javascript
setLogLevel(Logger.LOG, true); // forces LogLevel to LOG
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

##Bookmarklet

You can use the following bookmarklet in a browser to specify your loglevel. Save the below script as a bookmark and click on it when you want to modify the stored cookie value.

```javascript
javascript:(function() { var val = prompt('Enter log level (From -1 to 4)'); if (!val && val !== 0) { return; } document.cookie='_bvui_debug=logLevel:' + val; }());
```
