![](https://magnum.travis-ci.com/bazaarvoice/bv-ui-core.svg?token=hwKyg8j4RFg7BgmSksac&branch=master)

# bv-ui-core

This project provides a central location for common Bazaarvoice UI code. It is
intended to be installed into a project via npm. Individual modules are authored
as CommonJS modules, to be consumed by Webpack or another build tool that can
ingest CommonJS.

**This is a public repository.** Please see the [contribution guidelines][1] for
details on contributing to this repo.

## Installation

You will need NPM to add this to your project; it is installed when you install
Node, so it is likely that you already have it. If not, you can install Node
using an [installer][2], or by using your favorite package manater (such as
Homebrew).

Once you have NPM, you can install bv-ui-core as follows:

```bash
npm install --save bv-ui-core
```

## Usage

Require bv-ui-core modules into your code:

```javascript
var someModule = require('bv-ui-core/lib/someModule');
someModule.doThings();
```

For details on how to use a specific module, see the README document in the
module's directory.

## Modules

- [body](./lib/body)
- [checkHighContrast](./lib/checkHighContrast)
- [date.now](./lib/date.now)
- [domainPolice](./lib/domainPolice)
- [global](./lib/global)
- [parseUri](./lib/parseUri)
- [performance](./lib/performance)

[1]: ./CONTRIBUTING.md
[2]: https://nodejs.org/download/
