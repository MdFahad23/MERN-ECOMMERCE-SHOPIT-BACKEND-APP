const router = require("express").Router();

const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
} = require("../controller/user.Controller");
const upload = require("../middleware/multer");

router.route("/register").post(upload, signUp);
router.route("/login").post(signIn);
router.route("/password/forget").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
