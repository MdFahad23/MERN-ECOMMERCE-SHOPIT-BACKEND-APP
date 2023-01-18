const userRouter = require("../routes/userRoutes");

module.exports = (app) => {
  app.use("/api/v1/user", userRouter);
};
