const express = require("express");

const userRouter = require("../routes/userRoutes");
const categoryRouter = require("../routes/categoryRoutes");
const productRouter = require("../routes/productRoutes");
const cartItemRouter = require("../routes/cartItemRoutes");
const profileRouter = require("../routes/profileRoutes");
const paymentRouter = require("../routes/paymentRoutes");

module.exports = (app) => {
  app.use("/public", express.static("public"));
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1", productRouter);
  app.use("/api/v1/cart", cartItemRouter);
  app.use("/api/v1/profile", profileRouter);
  app.use("/api/v1/payment", paymentRouter);
};
