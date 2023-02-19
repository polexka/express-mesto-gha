const Card = require('../models/card');
const { forbiddenError } = require('../utils/errors/Forbidden');

const { notFoundError } = require('../utils/errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user })
    .then((card) => Card.findById(card._id).populate('owner'))
    .then((card) => {
      if (!card) return Promise.reject(notFoundError);
      return res.send(card);
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId).populate('owner')
    .then((card) => {
      if (!card) return Promise.reject(notFoundError);
      if (card.owner._id.toString() !== req.user._id) return Promise.reject(forbiddenError);

      return card;
    })
    .then(() => Card.findByIdAndRemove(req.params.cardId, { runValidators: true }))

    .then((card) => {
      if (!card) return Promise.reject(notFoundError);
      return res.send(card);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) return Promise.reject(notFoundError);
      return res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) return Promise.reject(notFoundError);
      return res.send(card);
    })
    .catch(next);
};
