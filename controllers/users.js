const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_KEY, JWT_SALT } = require('../utils/constants');

const { notFoundError } = require('../utils/errors/NotFoundError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, sameSite: true });

      return res.send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) return Promise.reject(notFoundError);
      return res.send(user);
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res) => {
  req.params.userId = req.user._id;

  return this.getUserById(req, res);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, avatar, about,
  } = req.body;

  bcrypt.hash(password, JWT_SALT)
    .then((hash) => User.create({
      email, password: hash, name, avatar, about,
    }))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) return Promise.reject(notFoundError);
      return res.send(user);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) return Promise.reject(notFoundError);
      return res.send(user);
    })
    .catch(next);
};
