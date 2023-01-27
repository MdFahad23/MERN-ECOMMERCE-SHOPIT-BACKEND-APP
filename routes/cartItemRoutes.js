const router = require("express").Router();

const {
  createCartItem,
  getCartItem,
  updateCartItem,
  deleteCartItem,
} = require("../controller/cartItem.Controller");
const authorize = require("../middleware/authorize");

router
  .route("/")
  .post(authorize, createCartItem)
  .get(authorize, getCartItem)
  .put(authorize, updateCartItem);

router.route("/:id").delete(authorize, deleteCartItem);
module.exports = router;
