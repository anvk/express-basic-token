# express-basic-token [![Build Status](https://travis-ci.org/anvk/express-basic-token.svg?branch=master)](https://travis-ci.org/anvk/express-basic-token)

> Express/conect middleware for basic token authentication.

## Usage

This is a very basic authentication middleware which simply looks for a present token
in query, body or headers. This could be used for private APIs which are used withint your company
but you still want to add some level of security so that not everyone can simply call those APIs.

## Install

```
$ npm install express-basic-token --save
```

## Options

* `token` (`String`) - Token secret key.
* `tokenName` (`String`) - Token name which will be searched for in query, params or headers. Default: `x-access-token`
* `notAuthorizedJSON` (`Object`) - object returned to the client when token does not match. Default: `{ message: 'Not Authorized' }`
* `invalidTokenJSON` (`Object`) - object returned to the client when token is not present or listed in multiple places. Default: `{ message: 'Invalid Token' }`

## Usage

Basic usage

ES5

```js
var basicAuthToken = require('express-basic-token');

app.use(basicAuthToken({ token: 'very-secret' });
```

ES6

```js
import basicAuthToken from 'express-basic-token';

app.use(basicAuthToken({ token: 'very-secret' });
```

To apply middleware for specific routes

```js
app.use('/protected/*', basicAuthToken({ token: 'very-secret' });
```

To make exception for protected routes

```js
app.use('/protected/*', basicAuthToken({ token: 'very-secret' }).unless({ path: ['/protected/not/this/one'] }));
```

or another example

```js
app.use(basicAuthToken({ token: 'very-secret' }).unless({ path: ['/not-protected/*'] }));
```

> Unless allows you to specify array or regex or string or for any other extra options, please see [express-unless](https://github.com/jfromaniello/express-unless).

You can specify your custom error objects for invalid token authorization

```js
app.use(basicAuthToken({
  token: 'very-secret',
  invalidTokenJSON: { message: 'Server Error' },
  notAuthorizedJSON: { message: 'Not Allowed!' }
});
```

To specify custom token header

```js
app.use(basicAuthToken({
  token: 'very-secret',
  tokenName: 'MY-TOKEN'
});
```

## License

MIT license; see [LICENSE](./LICENSE).
