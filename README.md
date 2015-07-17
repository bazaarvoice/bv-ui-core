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

## Linting

This project uses eslint, which is installed as part of the dev dependencies. Simply run the `lint` npm script, like so:

```bash
npm run lint
```

If you see no output, that's a sign that all linting was successful and zero problems were found.

## Testing

This project is using [tape](https://github.com/substack/tape) for its testing, and right now consists of unit tests. There is a `test` npm script that can be used to run all tests in PhantomJS.

```bash
npm test
```

You can also run the tests in Chrome, and have it stay open during development. Note that the test results appear in the console, not in the browser itself.

```bash
npm run dev
```
