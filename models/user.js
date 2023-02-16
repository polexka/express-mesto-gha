const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
const { accountError } = require('../utils/errors/AccountError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введен некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, {
  toObject: { useProjection: true },
  toJSON: { useProjection: true },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(accountError);

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return Promise.reject(accountError);

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
