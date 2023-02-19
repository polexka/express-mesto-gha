const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const responseError = require('./middlewares/responseError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { notFoundError } = require('./utils/errors/NotFoundError');
// eslint-disable-next-line no-unused-vars
const { regexURL, DEFAULT_ALLOWED_METHODS } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const allowedCors = ['https://api.mesto-polka.students.nomoredomains.work', 'https://mesto-polexka.students.nomoredomains.work'];
const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};
const app = express();
app.use(cookieParser());

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexURL),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(notFoundError.statusCode).send({ message: notFoundError.message });
});

app.use(errorLogger);
app.use(errors());
app.use(responseError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
