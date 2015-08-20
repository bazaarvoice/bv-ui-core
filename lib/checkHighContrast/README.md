# checkHighContrast

This is a small method to do the somewhat complicated job of figuring out
whether a browser is operating in high contrast mode. The end goal is to be
able to style the page differently so these users.

# Limitations

This works on all Windows browsers but only Firefox on Mac. The way this works
is by detecting when the browser's computed styles are different than the
given ones. In Windows, the high contrast theme coerces the browsers to ignore
a website's given styles in favor of its own. In OSX, the system level high
contrast settings will alter the entire display at a lower level so browsers
won't be aware of it and therefore neither will we. Firefox has options in
the content pane of preferences to ignore website's styles and will behave
similarly to Windows at that point. The likelihood of Apple changing their
approach anytime soon is probably small.

## Usage
```javascript
var checkHighContrast = require('checkHighContrast');

if( checkHighContrast(body) ) {
... setup alternate styles ...
}
```
