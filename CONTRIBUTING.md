# Contributing to bv-ui-core

## Owners

- Rebecca Murphey (@rmurphey)
- Reason (@reason-bv)
- Brian Sinclair (@brianarn)

## Getting Started

Start by creating a fork of this repo, cloning it locally, and installing the required Node modules:

```sh
git clone git@github.com:<yourusername>/bv-ui-core.git
cd bv-ui-core
npm install
```

Verify the installation by running `npm run dev`. This should open Chrome to the test page; you will need to open the browser's console to see the test results.

If you would like to submit a change to the repo, open a pull request *from a branch on your fork*. Do not create new branches on the main repo.

## Adding New Modules

If you want to submit a new module, be certain to open an issue explaining the rationale for adding the module, as well as the proposed API for the module. **Please do not start the discussion with a pull request.**

Given that the modules in this repo are intended for use in user interfaces, please be extremely mindful of adding dependencies. Wherever possible, a module should allow dependencies to be passed to it as arguments:

```js
module.exports = function myModule ($) {
    return {
        awesome : function (arg) {
            return $(arg);
        }
    };
};
```

## Landing Changes

Pull requests should be landed with [git-land](https://github.com/git-land/git-land). **Do not land pull requests using the Github merge button.**

## File Structure

For a module `foo`, *at least* the following files should exist:

- `lib/foo/index.js`
- `lib/foo/README.md`
- `test/unit/foo/index.js`

## Commit Hooks

This project uses [ghooks](https://github.com/gtramontina/ghooks) to manage Git hooks. The hooks run linting before each commit, and run the tests before each push.

## Style

The coding style for this project is checked with [ESLint](http://eslint.org/), and defined by the .eslintrc file. To run ESLint:

```
npm run lint
```

If you see no output, no problems were found.

## Tests

This project uses [tape](https://github.com/substack/tape). To run the tests:

```bash
npm test
```

To run the tests in a browser while you are doing development:

```bash
npm run dev
```

Note that the results appear in the console, not in the browser itself.

## Local Development with Another Project

If you are working on this project alongside a project that uses it, you will likely want to use [`npm link`][npm-link]. It allows you to install an NPM package in your project from the local file system, rather than pulling the package down from NPM.

Assuming that you've checked out `bv-ui-core` to `~/code/bv-ui-core` and your project is at `~/code/my-project`, you can run the following commands in the shell to get your project to use the local bv-ui-core:

```bash
cd ~/code/bv-ui-core
npm link
cd ~/code/my-project
npm link bv-ui-core
```

Alternatively, you can combine the two steps into one:

```bash
cd ~/code/my-project
npm link ../bv-ui-core
```

See the [`npm link` documentation][npm-link] for more details.

[npm-link]: https://docs.npmjs.com/cli/link
