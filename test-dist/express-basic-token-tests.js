'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _chai = require('chai');

var _distExpressBasicTokenJs = require('../dist/express-basic-token.js');

var _distExpressBasicTokenJs2 = _interopRequireDefault(_distExpressBasicTokenJs);

describe('express-basic-token', function () {
  var middleware = undefined,
      testIndex = undefined;

  var errorMessage = 'express-basic-token: token should be set';
  var token = '4B2C9A3C-E7A1-11E5-A86D-CA25ADB65F8F';
  var HTTP_INVALID_TOKEN = 400;
  var HTTP_NOT_AUTHORIZED = 403;
  var NEXT_WAS_CALLED = 1;
  var NEXT_WAS_NOT_CALLED = 0;
  var next = function next() {
    testIndex = testIndex + 1;
  };
  var res = function res(resultStatus, resultJSON) {
    return {
      status: function status(s) {
        return (0, _chai.expect)(s).to.equal(resultStatus);
      },
      json: function json(j) {
        return (0, _chai.expect)(j).to.deep.equal(resultJSON);
      }
    };
  };

  beforeEach(function () {
    testIndex = 0;
  });

  it('no token option was provided', function () {
    try {
      middleware = (0, _distExpressBasicTokenJs2['default'])();
    } catch (error) {
      (0, _chai.expect)(error.message).to.equal(errorMessage);
    }
  });

  it('proper token in query', function () {
    middleware = (0, _distExpressBasicTokenJs2['default'])({ token: token });

    var req = {
      query: {
        'x-access-token': token
      }
    };

    middleware(req, res(), next);

    (0, _chai.expect)(testIndex).to.equal(NEXT_WAS_CALLED);
  });

  it('proper token in body', function () {
    middleware = (0, _distExpressBasicTokenJs2['default'])({ token: token });

    var req = {
      body: {
        'x-access-token': token
      }
    };

    middleware(req, res(), next);

    (0, _chai.expect)(testIndex).to.equal(NEXT_WAS_CALLED);
  });

  it('proper token in header', function () {
    middleware = (0, _distExpressBasicTokenJs2['default'])({ token: token });

    var req = {
      headers: {
        'x-access-token': token
      }
    };

    middleware(req, res(), next);

    (0, _chai.expect)(testIndex).to.equal(NEXT_WAS_CALLED);
  });

  it('different token name', function () {
    var tokenName = 'myToken';

    middleware = (0, _distExpressBasicTokenJs2['default'])({ tokenName: tokenName, token: token });

    var req = {
      headers: _defineProperty({}, tokenName, token)
    };

    middleware(req, res(), next);

    (0, _chai.expect)(testIndex).to.equal(NEXT_WAS_CALLED);
  });

  it('no token present', function () {
    middleware = (0, _distExpressBasicTokenJs2['default'])({ token: token });

    var req = {};
    var resultJSON = { message: 'Invalid Token' };

    middleware(req, res(HTTP_INVALID_TOKEN, resultJSON), next);

    (0, _chai.expect)(testIndex).to.equal(NEXT_WAS_NOT_CALLED);
  });

  it('wrong token', function () {
    middleware = (0, _distExpressBasicTokenJs2['default'])({ token: token });

    var req = {
      headers: {
        'x-access-token': 'WRONG TOKEN'
      }
    };
    var resultJSON = { message: 'Not Authorized' };

    middleware(req, res(HTTP_NOT_AUTHORIZED, resultJSON), next);

    (0, _chai.expect)(testIndex).to.equal(NEXT_WAS_NOT_CALLED);
  });

  it('wrong token with custom error', function () {
    var notAuthorizedJSON = { message: 'Not Allowed!' };

    middleware = (0, _distExpressBasicTokenJs2['default'])({ token: token, notAuthorizedJSON: notAuthorizedJSON });

    var req = {
      headers: {
        'x-access-token': 'WRONG TOKEN'
      }
    };

    middleware(req, res(HTTP_NOT_AUTHORIZED, notAuthorizedJSON), next);

    (0, _chai.expect)(testIndex).to.equal(NEXT_WAS_NOT_CALLED);
  });

  it('proper token present in more than one location', function () {
    middleware = (0, _distExpressBasicTokenJs2['default'])({ token: token });

    var req = {
      body: {
        'x-access-token': token
      },
      headers: {
        'x-access-token': token
      }
    };
    var resultJSON = { message: 'Invalid Token' };

    middleware(req, res(HTTP_INVALID_TOKEN, resultJSON), next);

    (0, _chai.expect)(testIndex).to.equal(NEXT_WAS_NOT_CALLED);
  });

  it('proper token present in more than one location with custom error', function () {
    var invalidTokenJSON = { message: 'Server Error' };

    middleware = (0, _distExpressBasicTokenJs2['default'])({ token: token, invalidTokenJSON: invalidTokenJSON });

    var req = {
      body: {
        'x-access-token': token
      },
      headers: {
        'x-access-token': token
      }
    };

    middleware(req, res(HTTP_INVALID_TOKEN, invalidTokenJSON), next);

    (0, _chai.expect)(testIndex).to.equal(NEXT_WAS_NOT_CALLED);
  });
});