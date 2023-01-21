const router = require("express").Router();

const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUser,
} = require("../controller/user.Controller");
const upload = require("../middleware/multer");
const authorize = require("../middleware/authorize");

router.route("/register").post(upload, signUp);
router.route("/login").post(signIn);
router.route("/password/forget").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(authorize, getUserDetails);
router.route("/password/update").put(authorize, updatePassword);
router.route("/update/me").put(authorize, upload, updateUser);

module.exports = router;
