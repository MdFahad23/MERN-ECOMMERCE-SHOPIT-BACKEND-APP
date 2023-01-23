const router = require("express").Router();

const {
  createProduct,
  getProducts,
  getProductById,
  getPhoto,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller");
const authorize = require("../middleware/authorize");
const admin = require("../middleware/admin");

router.route("/admin/product/new").post(authorize, admin, createProduct);
router.route("/products").get(getProducts);
router
  .route("/admin/product/:id")
  .get(authorize, admin, getProductById)
  .delete(authorize, admin, deleteProduct);
router.route("/product/photo/:id").get(getPhoto);
router.route("/admin/product/update/:id").put(authorize, admin, updateProduct);

module.exports = router;
