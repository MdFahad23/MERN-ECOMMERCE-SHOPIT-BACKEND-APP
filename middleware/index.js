const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: "*" }));
  if (process.env.NODE_ENV === "development") {
    app.use(morgan());
  }
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(
    compression({
      level: 6,
      threshold: 10 * 1000,
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          return false;
        }
        return compression.filter(req, res);
      },
    })
  );
};
