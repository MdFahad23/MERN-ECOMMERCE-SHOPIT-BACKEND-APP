const router = require("express").Router();

const { createProduct } = require("../controller/product.controller");
const authorize = require("../middleware/authorize");
const admin = require("../middleware/admin");

router.route("/admin/product/new").post(authorize, admin, createProduct);

module.exports = router;
