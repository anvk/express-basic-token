import { expect } from 'chai';
import basicAuthToken from '../dist/express-basic-token.js';

describe('express-basic-token', () => {
  let middleware, testIndex;

  const errorMessage = 'express-basic-token: token should be set';
  const token = '4B2C9A3C-E7A1-11E5-A86D-CA25ADB65F8F';
  const HTTP_INVALID_TOKEN = 400;
  const HTTP_NOT_AUTHORIZED = 403;
  const NEXT_WAS_CALLED = 1;
  const NEXT_WAS_NOT_CALLED = 0;
  const next = () => {
    testIndex = testIndex + 1;
  };
  const res = (resultStatus, resultJSON) => ({
    status: s => expect(s).to.equal(resultStatus),
    json: j => expect(j).to.deep.equal(resultJSON)
  });

  beforeEach(() => { testIndex = 0; });

  it('no token option was provided', () => {
    try {
      middleware = basicAuthToken();
    } catch (error) {
      expect(error.message).to.equal(errorMessage);
    }
  });

  it('proper token in query', () => {
    middleware = basicAuthToken({ token });

    const req = {
      query: {
        'x-access-token': token
      }
    };

    middleware(req, res(), next);

    expect(testIndex).to.equal(NEXT_WAS_CALLED);
  });

  it('proper token in body', () => {
    middleware = basicAuthToken({ token });

    const req = {
      body: {
        'x-access-token': token
      }
    };

    middleware(req, res(), next);

    expect(testIndex).to.equal(NEXT_WAS_CALLED);
  });

  it('proper token in header', () => {
    middleware = basicAuthToken({ token });

    const req = {
      headers: {
        'x-access-token': token
      }
    };

    middleware(req, res(), next);

    expect(testIndex).to.equal(NEXT_WAS_CALLED);
  });

  it('different token name', () => {
    const tokenName = 'myToken';

    middleware = basicAuthToken({ tokenName, token });

    const req = {
      headers: {
        [tokenName]: token
      }
    };

    middleware(req, res(), next);

    expect(testIndex).to.equal(NEXT_WAS_CALLED);
  });

  it('no token present', () => {
    middleware = basicAuthToken({ token });

    const req = {};
    const resultJSON = { message: 'Invalid Token' };

    middleware(req, res(HTTP_INVALID_TOKEN, resultJSON), next);

    expect(testIndex).to.equal(NEXT_WAS_NOT_CALLED);
  });

  it('wrong token', () => {
    middleware = basicAuthToken({ token });

    const req = {
      headers: {
        'x-access-token': 'WRONG TOKEN'
      }
    };
    const resultJSON = { message: 'Not Authorized' };

    middleware(req, res(HTTP_NOT_AUTHORIZED, resultJSON), next);

    expect(testIndex).to.equal(NEXT_WAS_NOT_CALLED);
  });

  it('wrong token with custom error', () => {
    const notAuthorizedJSON = { message: 'Not Allowed!' };

    middleware = basicAuthToken({ token, notAuthorizedJSON });

    const req = {
      headers: {
        'x-access-token': 'WRONG TOKEN'
      }
    };

    middleware(req, res(HTTP_NOT_AUTHORIZED, notAuthorizedJSON), next);

    expect(testIndex).to.equal(NEXT_WAS_NOT_CALLED);
  });

  it('proper token present in more than one location', () => {
    middleware = basicAuthToken({ token });

    const req = {
      body: {
        'x-access-token': token
      },
      headers: {
        'x-access-token': token
      }
    };
    const resultJSON = { message: 'Invalid Token' };

    middleware(req, res(HTTP_INVALID_TOKEN, resultJSON), next);

    expect(testIndex).to.equal(NEXT_WAS_NOT_CALLED);
  });

  it('proper token present in more than one location with custom error', () => {
    const invalidTokenJSON = { message: 'Server Error' };

    middleware = basicAuthToken({ token, invalidTokenJSON });

    const req = {
      body: {
        'x-access-token': token
      },
      headers: {
        'x-access-token': token
      }
    };

    middleware(req, res(HTTP_INVALID_TOKEN, invalidTokenJSON), next);

    expect(testIndex).to.equal(NEXT_WAS_NOT_CALLED);
  });
});

