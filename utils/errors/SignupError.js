class SignupError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SignupError';
    this.statusCode = 409;
  }
}

module.exports.signupError = new SignupError('Пользователь с такой почтой уже существует.');
