const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../model/userModel");
const { sendEmail } = require("../utils/sendEmail");

// Create new User
module.exports.signUp = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = {};
  user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered!");

  let photo = req.file ? req.file.filename : "";
  let { name, email, password } = req.body;
  user = new User({ name, email, password, photo });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateJWT();

  const result = await user.save();
  res.status(201).send({
    message: "Registration Successfully! ",
    token: token,
    user: _.pick(result, ["_id", "name", "email", "photo"]),
  });
};

// Login User
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

// Forgot Password
module.exports.forgotPassword = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("User not Found!");

  // Get ResetPassword Token
  let resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `SHOP IT Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return res.status(500).send(error.message);
  }
};
