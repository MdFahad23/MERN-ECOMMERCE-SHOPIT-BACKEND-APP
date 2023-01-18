const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../model/userModel");

module.exports.signUp = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = {};
  user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered!");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateJWT();

  const result = await user.save();
  res.status(201).send({
    message: "Registration Successfully! ",
    token: token,
    user: _.pick(result, ["_id", "name", "email"]),
  });
};

module.exports.signIn = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalided User!");

  let validUser = await bcrypt.compare(req.body.password, user.password);
  if (!validUser) return res.status(400).send("Invalided User!");

  let token = user.generateJWT();
  res.status(200).send({
    message: "Login Successfully! ",
    token: token,
    user: _.pick(user, ["_id", "name", "email"]),
  });
};
