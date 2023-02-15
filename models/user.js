const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
// const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   validate: {
  //     validator: (email) => validator.isEmail(email),
  //     message: 'Введен некорректный email',
  //   },
  // },
  // password: {
  //   type: String,
  //   required: true,
  //   minlength: 8,
  //   select: false,
  // },
});

module.exports = mongoose.model('user', userSchema);
