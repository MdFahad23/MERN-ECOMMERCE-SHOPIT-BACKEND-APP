const { Schema, model } = require("mongoose");

module.exports.Profile = model(
  "Profile",
  Schema({
    user: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: "User",
      required: true,
    },
    phone: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postCode: String,
    country: String,
  })
);
