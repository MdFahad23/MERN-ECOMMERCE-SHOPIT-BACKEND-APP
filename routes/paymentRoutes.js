const router = require("express").Router();

const { initPayment } = require("../controller/payment.Controller");
const authorize = require("../middleware/authorize");

router.route("/").get(authorize, initPayment);

module.exports = router;
