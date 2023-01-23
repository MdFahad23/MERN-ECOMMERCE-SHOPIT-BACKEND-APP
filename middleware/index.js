const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  if (process.env.NODE_ENV === "development") {
    app.use(morgan());
  }
  app.use(helmet());
  app.use(compression());
};
