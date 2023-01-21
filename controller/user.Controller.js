const _ = require("lodash");
const { User, validate } = require("../model/userModel");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");

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

  let validUser = await user.comparePassword(req.body.password);
  if (!validUser) return res.status(400).send("Invalided User!");

  let token = user.generateJWT();
  res.status(200).send({
    message: "Login Successfully! ",
    token: token,
    user: _.pick(user, ["_id", "name", "email", "photo"]),
  });
};

// Forgot Password Send Email Token
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

// Reset Password
module.exports.resetPassword = async (req, res) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user)
    return res
      .status(400)
      .send("Reset Password Token is invalid or has been expired");

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send("Password does not Match!");

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  const token = user.generateJWT();

  const result = await user.save();

  return res.status(200).send({
    message: "Successfully password reset!",
    token: token,
    user: _.pick(result, ["_id", "name", "email", "photo"]),
  });
};

// Get User Details
module.exports.getUserDetails = async (req, res) => {
  let user = await User.findById(req.user._id);

  return res.status(200).send({
    success: true,
    user: _.pick(user, ["_id", "name", "email", "photo"]),
  });
};

// Update User Password
module.exports.updatePassword = async (req, res) => {
  let user = await User.findById(req.user._id);

  let validPassword = await user.comparePassword(req.body.oldPassword);
  if (!validPassword) return res.status(400).send("Old password is incorrect!");

  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.status(400).send("New Password doesn't Match!");
  }

  user.password = req.body.newPassword;

  let token = user.generateJWT();

  let result = await user.save();

  return res.status(200).send({
    success: true,
    token: token,
    user: _.pick(result, ["_id", "name", "email", "photo"]),
  });
};

// Update User
module.exports.updateUser = async (req, res) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.file !== "") {
    newUserData.photo = req.file.filename;
  }

  const users = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res.status(200).send({
    success: true,
    message: "User Update Successfully!",
  });
};

// Get All User(admin)
module.exports.getAllUser = async (req, res) => {
  const user = await User.find();

  if (!user) return res.status(400).send("User Not Found!");

  return res.status(200).send({
    success: true,
    user: _.pick(user, ["_id", "name", "email", "photo"]),
  });
};

// Get Single User(admin)
module.exports.getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res
      .status(400)
      .send(`User does not exist with Id: ${req.params.id}`);

  return res.status(200).send({
    success: true,
    user: _.pick(user, ["_id", "name", "email", "photo"]),
  });
};
