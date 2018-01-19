# test-http-get

> Test if a http request succeedes or not.

![Node version](https://img.shields.io/node/v/test-http-get.svg)
[![Build Status](https://travis-ci.org/ralphtheninja/test-http-get.svg?branch=master)](https://travis-ci.org/ralphtheninja/test-http-get)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Use when you want to test if a resource exists and don't really care about the actual content of the resource. Will follow redirect responses.

## Install

```
$ npm i test-http-get -S
```

## Usage

Test if `rvagg/node-levelup` exists (GitHub should redirect to `level/levelup`):

```js
const test = require('test-http-get')
test('https://github.com/rvagg/node-levelup', (err, exists) => {
  console.log(exists) // --> true
})
```

## API

### `const test = require('test-http-get')`

Returns a single function, see below.

### `test(url, cb)`

Makes a http `HEAD` request on `url`.

* If the status code is a redirect response, the request will be made again based on the returned `Location` header. Chainable redirect responses are handled up until a limit of 5 steps.
* Calls back with `cb(null, true)` if the status code is `< 300`.
* Calls back with `cb(null, false)` for status codes `>= 400`.
* Calls back with `cb(err)` if no request could be made. Most likely an issue with the network or too many total redirect attempts.

## License

MIT
