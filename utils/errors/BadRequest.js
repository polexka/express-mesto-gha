class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequest';
    this.statusCode = 400;
  }
}

module.exports.badRequestError = new BadRequestError('Указан некорректный _id.');
