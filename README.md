![](https://magnum.travis-ci.com/bazaarvoice/bv-ui-core.svg?token=hwKyg8j4RFg7BgmSksac&branch=master)

# bv-ui-core

This project provides a central location for common Bazaarvoice UI code. It is intended to be installed into a project via npm. Individual modules are authored as CommonJS modules, to be consumed by Webpack or another build tool that can ingest CommonJS.

**This is a public repository.** Please see the [contribution guidelines]](./CONTRIBUTING.md) for details on contributing to this repo.

## Installation

You will need npm to add this to your project; it is installed when you install Node, so it is likely that you already have it. If not, you can install Node using an [installer](https://nodejs.org/download/), or by using your favorite package manater (such as Homebrew).

Once you have npm, you can install bv-ui-core:

```bash
npm install --save bv-ui-core
```

## Usage

Require bv-ui-core modules into your code:

```javascript
var someModule = require('bv-ui-core/lib/someModule');
someModule.doThings();
```

For details on how to use individual modules, see the README inside the module's directory.
