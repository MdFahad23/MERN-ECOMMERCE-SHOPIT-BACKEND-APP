require("dotenv").config();
const SSLCommerzPayment = require("sslcommerz-lts");

const { CartItem } = require("../model/cartItemModel");
const { Profile } = require("../model/profileModel");

const store_id = process.env.STORE_ID;
const store_password = process.env.STORE_PASSWORD;
const is_live = false;

module.exports.initPayment = async (req, res) => {
  const userId = req.user._id;
  const cartItem = await CartItem.find({ user: userId });
  const profile = await Profile.findOne({ user: userId });

  const { phone, address1, address2, city, state, postCode, country } = profile;

  const total_amount = cartItem
    .map((item) => item.price * item.count)
    .reduce((a, b) => a + b, 0);

  const tran_id =
    "_" + Math.random().toString(36).substring(2, 9) + new Date().getTime();

  const num_item = cartItem
    .map((item) => item.count)
    .reduce((a, b) => a + b, 0);

  const data = {
    total_amount: total_amount,
    currency: "BDT",
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: "http://localhost:3030/success",
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "General",
    product_profile: "general",
    cus_name: req.user.name,
    cus_email: req.user.email,
    cus_add1: address1,
    cus_add2: address2,
    cus_city: city,
    cus_state: state,
    cus_postcode: postCode,
    cus_country: country,
    cus_phone: phone,
    cus_fax: phone,
    ship_name: req.user.name,
    ship_add1: address1,
    ship_add2: address2,
    ship_city: city,
    ship_state: state,
    ship_postcode: postCode,
    ship_country: country,
  };

  const SSLCommer = new SSLCommerzPayment(store_id, store_password, is_live);
  const SSLData = await SSLCommer.init(data);
  return res.status(200).send(SSLData);
};
