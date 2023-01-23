const router = require("express").Router();

const {
  createProduct,
  getProducts,
} = require("../controller/product.controller");
const authorize = require("../middleware/authorize");
const admin = require("../middleware/admin");

router.route("/admin/product/new").post(authorize, admin, createProduct);
router.route("/products").get(getProducts);

module.exports = router;
