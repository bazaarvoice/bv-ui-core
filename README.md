![](https://magnum.travis-ci.com/bazaarvoice/bv-ui-core.svg?token=hwKyg8j4RFg7BgmSksac&branch=master)

# bv-ui-core

This repository is for the shared storage of all Bazaarvoice UI code. Right now, there's not much in here, but we'll be fleshing out and adding more modules over time.

## Usage

Using npm, install this module:

```bash
npm install --save git+ssh://git@github.com:bazaarvoice/bv-ui-core.git
```

Once installed, you can simply `require` modules out of `lib` as you see fit.

```javascript
var someModule = require('bv-ui-core/lib/someModule');
someModule.doThings();
```
