# Beautify.hks

Beautify your javascript with each commit

## Usage

**If you don't have `hooks` installed**

1. `npm install node-hooks -g`
2. `hooks install`
3. `hooks add beautify.hks`

**If `hooks` is installed, but not managing you're git-hooks yet**

1. `hooks install`
2. `hooks add beautify.hks`

**Else**

`hooks add beautify.hks`

## Setting up beautify to format like you format

Currently beautify.hks will use [the default beautify options](./beautify_defaults.json).

This is comming soon. [First `hooks` needs to add a config ability... wanna help?](https://github.com/mcwhittemore/node-hooks/issues/10)

## Change Log

### 0.0.3

* Adding in config script for install

### 0.0.2

* Started using [staged-git-files](https://npmjs.org/package/staged-git-files) to get the staged git files.

### 0.0.1

* mvp