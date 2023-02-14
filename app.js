const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { notFound } = require('./utils/errors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '63eacbea7564bf5c622d6a5e',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(notFound).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
