require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const helmet = require('helmet');

const { errors } = require('celebrate');

const { PORT = 3000, DB = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env; // MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
// Слушаем 3000 порт

const mainErrorHandler = require('./middlewares/mainErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const mainRouter = require('./routes/index');
const { limiter } = require('./middlewares/limiter');

const app = express();
app.use(cors());
app.use(helmet());
mongoose.connect(DB, {})
  .then(() => {
    console.log('connected');
  })
  .catch(() => {
    console.log('no connection');
  });
app.use(express.json());
// Встроенный посредник, разбирающий входящие запросы в объект в формате JSON.

app.use(requestLogger);

app.use(limiter);

app.use(mainRouter);

app.use(errorLogger);

app.use(errors());

app.use(mainErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
