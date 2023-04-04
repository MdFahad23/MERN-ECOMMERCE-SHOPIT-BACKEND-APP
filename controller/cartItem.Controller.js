const _ = require("lodash");
const { CartItem } = require("../model/cartItemModel");

// Create CartItem
module.exports.createCartItem = async (req, res) => {
  let { price, product } = _.pick(req.body, ["price", "product"]);
  const item = await CartItem.findOne({ user: req.user._id, product: product });
  if (item)
    return res.status(400).send({ message: "Item already exists in Cart!" });

  let cartItem = new CartItem({
    product: product,
    price: price,
    user: req.user._id,
  });
  let result = await cartItem.save();

  return res.status(201).send({
    message: "Added to cart Successfully!",
    data: result,
  });
};

// Get CartItem
module.exports.getCartItem = async (req, res) => {
  let cartItem = await CartItem.find({ user: req.user._id })
    .populate("product", "name")
    .populate("user", "name");

  return res.status(200).send(cartItem);
};

// Update CartItem
module.exports.updateCartItem = async (req, res) => {
  const { _id, count } = _.pick(req.body, ["_id", "count"]);

  await CartItem.updateOne({ _id: _id, user: req.user._id }, { count: count });
  return res.status(200).send({ message: "Item Updated!!" });
};

// Delete CartItem
module.exports.deleteCartItem = async (req, res) => {
  let _id = req.params.id;
  await CartItem.deleteOne({ _id: _id, user: req.user._id });
  return res.status(200).send({ message: "delete!!" });
};
