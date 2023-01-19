const router = require("express").Router();

const {
  signUp,
  signIn,
  forgotPassword,
} = require("../controller/user.Controller");
const upload = require("../middleware/multer");

router.route("/register").post(upload, signUp);
router.route("/login").post(signIn);
router.route("/password/reset").post(forgotPassword);

module.exports = router;
