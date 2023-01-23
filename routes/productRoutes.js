const router = require("express").Router();

const {
  createProduct,
  getProducts,
  getProductById,
  getPhoto,
} = require("../controller/product.controller");
const authorize = require("../middleware/authorize");
const admin = require("../middleware/admin");

router.route("/admin/product/new").post(authorize, admin, createProduct);
router.route("/products").get(getProducts);
router.route("/product/:id").get(getProductById);
router.route("/product/photo/:id").get(getPhoto);

module.exports = router;
