const router = require("express").Router();

const {
  initPayment,
  ipn,
  GetOrder,
} = require("../controller/payment.Controller");
const authorize = require("../middleware/authorize");

router.route("/").get(authorize, initPayment);

router.route("/ipn").post(ipn);

// Order Router
router.route("/order").get(authorize, GetOrder);

module.exports = router;
