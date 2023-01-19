const express = require("express");

const userRouter = require("../routes/userRoutes");

module.exports = (app) => {
  app.use("/public", express.static("public"));
  app.use("/api/v1/user", userRouter);
};
