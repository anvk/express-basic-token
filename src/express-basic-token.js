import unless from 'express-unless';

const HTTP_INVALID_TOKEN = 400;
const HTTP_NOT_AUTHORIZED = 403;

export default (options = {}) => {
  const {
    token,
    tokenName = 'x-access-token',
    notAuthorizedJSON = { message: 'Not Authorized' },
    invalidTokenJSON = { message: 'Invalid Token' }
  } = options;

  if (!token) {
    throw new Error('express-basic-token: token should be set');
  }

  const middleware = (req, res, next) => {
    function getToken(requestLocation, tokenName) {
      return (req[requestLocation] && req[requestLocation][tokenName])
        ? req[requestLocation][tokenName]
        : undefined;
    }

    const queryToken = getToken('query', tokenName);
    const bodyToken = getToken('body', tokenName);
    const headerToken = getToken('headers', tokenName);

    const error = (!!queryToken + !!bodyToken + !!headerToken !== 1);
    const reqToken = queryToken || bodyToken || headerToken;

    // Token should exist
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

  middleware.unless = unless;

  return middleware;
};
