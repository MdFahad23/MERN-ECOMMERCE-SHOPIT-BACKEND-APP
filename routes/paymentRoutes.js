const router = require("express").Router();

const { initPayment, ipn } = require("../controller/payment.Controller");
const authorize = require("../middleware/authorize");

router.route("/").get(authorize, initPayment);

router.route("/ipn").post(ipn);

module.exports = router;
