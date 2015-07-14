# bv-ui-core

This repository is for the shared storage of all Bazaarvoice UI code. Right now, there's not much in here, but we'll be fleshing out and adding more modules over time.

## Style Guide

Meet the style as defined by the `.eslintrc` file. The easiest way to tell if you're doing so is to make your changes, `npm run lint`, and see what errors are displayed.

## File Structure

In general, for any module `foo`, the following files should exist:

- `lib/foo/index.js`
- `lib/foo/README.md` (as this will help GitHub auto-render it upon view of the folder)
- `test/unit/foo/index.js`

Additionally, a successful run of both the `test` and `lint` npm scripts will be required for code to be accepted.
