class AccessError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessError';
    this.statusCode = 401;
  }
}

module.exports.accessError = new AccessError('Необходимо авторизоваться.');
