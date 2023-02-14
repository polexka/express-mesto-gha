const Card = require('../models/card');

const {
  OK, badRequest, serverError, notFound,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(OK).send(cards))
    .catch(() => res.status(serverError).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user })
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(badRequest).send({ message: 'Переданы некорректные данные при создании карточки.' });
      return res.status(serverError).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(notFound).send({ message: 'Карточка с указанным _id не найдена.' });
      return res.status(serverError).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      if (err.name === 'CastError') return res.status(notFound).send({ message: 'Передан несуществующий _id карточки.' });
      return res.status(serverError).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      if (err.name === 'CastError') return res.status(notFound).send({ message: 'Передан несуществующий _id карточки.' });
      return res.status(serverError).send({ message: 'Ошибка по умолчанию.' });
    });
};
