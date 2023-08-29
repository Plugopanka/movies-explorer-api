const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const { ERROR_ON_SERVER } = require('./errors/errors');

const { PORT = 4000, BASE_ADDRESS = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(
  cors({
    origin: ['http://localhost:4001', 'https://plugopanka.nomoredomainsicu.ru'],
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(BASE_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(helmet());

app.use(limiter);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_ON_SERVER, message } = err;
  res.status(statusCode).send({
    message: statusCode === ERROR_ON_SERVER ? 'Произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`listening ${PORT}`);
});
