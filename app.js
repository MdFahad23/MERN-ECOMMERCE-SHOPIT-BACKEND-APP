require("express-async-errors");
const express = require("express");
const app = express();
const error = require("./middleware/error");

// All middleware
require("./middleware")(app);
require("./middleware/routes")(app);

// Error Handler
app.use(error);

module.exports = app;
