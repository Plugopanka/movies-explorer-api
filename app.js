const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const cors = require("cors");

require("dotenv").config();
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { ERROR_ON_SERVER } = require("./errors/errors");

const { PORT = 4000 } = process.env;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:4001", "https://nomoremesto.nomoreparties.co"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://0.0.0.0:27017/bitfilmsdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(require("./routes/index"));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_ON_SERVER, message } = err;
  res.status(statusCode).send({
    message: statusCode === ERROR_ON_SERVER ? "Произошла ошибка" : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`listening ${PORT}`);
});
