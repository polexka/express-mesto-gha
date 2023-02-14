const User = require('../models/user');

const {
  OK, badRequest, serverError, notFound,
} = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(serverError).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(notFound).send({ message: 'Пользователь по указанному _id не найден.' });
      return res.status(serverError).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, about } = req.body;

  User.create({ name, avatar, about })
    .then((user) => res.status(OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return res.status(serverError).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
    },
  )
    .then((user) => res.status(OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      if (err.name === 'CastError') return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден.' });
      return res.status(serverError).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
    },
  )
    .then((user) => res.status(OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      if (err.name === 'CastError') return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден.' });
      return res.status(serverError).send({ message: 'Ошибка по умолчанию.' });
    });
};
