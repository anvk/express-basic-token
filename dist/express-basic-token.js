'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _expressUnless = require('express-unless');

var _expressUnless2 = _interopRequireDefault(_expressUnless);

var HTTP_INVALID_TOKEN = 400;
var HTTP_NOT_AUTHORIZED = 403;

exports['default'] = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var token = options.token;
  var _options$tokenName = options.tokenName;
  var tokenName = _options$tokenName === undefined ? 'x-access-token' : _options$tokenName;
  var _options$notAuthorizedJSON = options.notAuthorizedJSON;
  var notAuthorizedJSON = _options$notAuthorizedJSON === undefined ? { message: 'Not Authorized' } : _options$notAuthorizedJSON;
  var _options$invalidTokenJSON = options.invalidTokenJSON;
  var invalidTokenJSON = _options$invalidTokenJSON === undefined ? { message: 'Invalid Token' } : _options$invalidTokenJSON;

  if (!token) {
    throw new Error('express-basic-token: token should be set');
  }

  var middleware = function middleware(req, res, next) {
    function getToken(requestLocation, tokenName) {
      return req[requestLocation] && req[requestLocation][tokenName] ? req[requestLocation][tokenName] : undefined;
    }

    var queryToken = getToken('query', tokenName);
    var bodyToken = getToken('body', tokenName);
    var headerToken = getToken('headers', tokenName);

    var error = !!queryToken + !!bodyToken + !!headerToken !== 1;
    var reqToken = queryToken || bodyToken || headerToken;

    // RFC6750. Token should exist only in one place
    if (error) {
      res.status(HTTP_INVALID_TOKEN);
      res.json(invalidTokenJSON);
      return;
    }

    // Authorize the user to see if s/he can access our resources
    if (token !== reqToken) {
      res.status(HTTP_NOT_AUTHORIZED);
      res.json(notAuthorizedJSON);
      return;
    }

    next(); // To move to next middleware
  };

  middleware.unless = _expressUnless2['default'];

  return middleware;
};

module.exports = exports['default'];