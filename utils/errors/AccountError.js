class AccountError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccountError';
    this.statusCode = 401;
  }
}

module.exports.accountError = new AccountError('Неправильные почта или пароль');
module.exports.authError = new AccountError('Необходима авторизация');
