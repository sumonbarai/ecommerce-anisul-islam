// basic lib import
const express = require("express");
const { readdirSync } = require("fs");
require("dotenv").config();
const colors = require("colors");

const createError = require("http-errors");

// security middleware import
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { mongodbConnection } = require("./src/config/db");
const { errorResponse } = require("./src/controllers/responseController");

const app = express();

// security middleware implement
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// dev dependency
app.use(morgan("dev"));

// public folder binding
app.use(express.static("public"));

// body parser implement
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

// request rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "too many request",
});

app.use(limiter);

// database connection
mongodbConnection().catch((err) => console.error("db connection failed".bgRed));

// routing implement
readdirSync("./src/routes").map(function (r) {
  return app.use("/api/v1", require(`./src/routes/${r}`));
});

// 404 route setup
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// error handler route
app.use((err, req, res, next) => {
  // custom error handle

  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
