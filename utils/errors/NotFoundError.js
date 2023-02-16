class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
    this.statusCode = 404;
  }
}

module.exports.notFoundError = new NotFoundError('Страницы не существует!');
