# Contributing to bv-ui-core

## Getting Started

Start by creating a fork of this repo and cloning it locally.

Once you have your local clone, run `npm install` in order to install all dependencies.

Once the install completes, run `npm run lint` and `npm run test` to run the linting and testing. If you see no output from the linting, and 100% passing tests from the test execution, then you're good to go.

## Local Development with another project

If you're looking to contribute, odds are good you're working on another project, and working to incorporate new content into `bv-ui-core`. The easiest way to work on both together is through [`npm link`][npm-link]. This command allows you to effectively install a package in your project via a link, instead of a traditional npm installation.

Assuming that you've checked out your `bv-ui-core` to `~/code/bv-ui-core` and your project is at `~/code/my-project`, you can run the following commands in the shell to set up the link.

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

The net result is the same, which is that `bv-ui-core` will be registered as a globally installed package via symbolic link, which you can then link into other packages on your local system.

Please check out the [`npm link` documentation][npm-link] for more details.

[npm-link]: https://docs.npmjs.com/cli/link

## Style Guide

Meet the style as defined by the `.eslintrc` file. The easiest way to tell if you're doing so is to make your changes, `npm run lint`, and see what errors are displayed.

## File Structure

In general, for any module `foo`, the following files should exist:

- `lib/foo/index.js`
- `lib/foo/README.md` (as this will help GitHub auto-render it upon view of the folder)
- `test/unit/foo/index.js`

Additionally, a successful run of both the `test` and `lint` npm scripts will be required for code to be accepted.

## Commit Hooks

This project uses [ghooks](https://github.com/gtramontina/ghooks) to manage Git hooks. The following should already be in place for you after installation:

- pre-commit: Run linting
- pre-push: Full test execution
