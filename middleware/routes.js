const express = require("express");

const userRouter = require("../routes/userRoutes");
const categoryRouter = require("../routes/categoryRoutes");

module.exports = (app) => {
  app.use("/public", express.static("public"));
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/category", categoryRouter);
};
