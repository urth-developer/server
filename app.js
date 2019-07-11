const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const multer = require("multer")
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/user');

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
require("./routes")(app);
// error handler
require("./Errorhandler")(app);

const PORT = 3000;

app.listen(PORT, () => {
  console.info(`[URTH-SERVER] Listening on Port ${PORT}`);
});

module.exports = app;
