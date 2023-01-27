const { Schema, model } = require("mongoose");

const cartItemSchema = Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: Number,
    count: {
      type: Number,
      default: 1,
      minLength: 1,
      maxLength: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports.CartItem = model("CartItem", cartItemSchema);
