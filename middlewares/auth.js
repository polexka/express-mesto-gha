const jwt = require('jsonwebtoken');
const { getUserInfo } = require('../controllers/users');
const { JWT_KEY } = require('../utils/constants');
const { authError } = require('../utils/errors/AccountError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) return res.status(authError.statusCode).send({ message: authError.message });

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    return res.status(authError.statusCode).send({ message: authError.message });
  }

  // сюда попадает { ._id = бла бла бла}
  req.user = payload;

  const user = await getUserInfo(req, res, next);

  return res.status(201).send({ message: user });

  // return next();
};
