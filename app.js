const express = require("express");
const app = express();

// All middleware
require("./middleware")(app);
require("./middleware/routes")(app);

module.exports = app;
