const Card = require('../models/card');

const { cardAccessError } = require('../utils/errors/AccessError');
const { notFoundError } = require('../utils/errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) return Promise.reject(notFoundError);
      if (card.owner.toString() !== req.user._id) return Promise.reject(cardAccessError);

      return card;
    })
    .then(() => Card.findByIdAndRemove(req.params.cardId, { runValidators: true }))
    .then((card) => {
      if (!card) return Promise.reject(notFoundError);
      return res.send(card);
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) return Promise.reject(notFoundError);
      return res.send(card);
    })
    .catch((err) => next(err));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) return Promise.reject(notFoundError);
      return res.send(card);
    })
    .catch((err) => next(err));
};
