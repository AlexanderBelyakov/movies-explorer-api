const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  UNAUTHORIZED_ERROR,
} = require('../constants/HHTP-status-codes');

const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(`Требуется авторизация ${UNAUTHORIZED_ERROR}`));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError(`Требуется авторизация ${UNAUTHORIZED_ERROR}`));
  }

  req.user = payload;
  console.log(req.user);

  return next(); // пропускаем запрос дальше
};
