const router = require("express").Router();

const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUser,
  getAllUser,
  getSingleUser,
} = require("../controller/user.Controller");
const upload = require("../middleware/multer");
const authorize = require("../middleware/authorize");
const admin = require("../middleware/admin");

router.route("/register").post(upload, signUp);
router.route("/login").post(signIn);
router.route("/password/forget").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(authorize, getUserDetails);
router.route("/password/update").put(authorize, updatePassword);
router.route("/update/me").put(authorize, upload, updateUser);
router.route("/admin/allUser").get(authorize, admin, getAllUser);
router.route("/admin/singleUser/:id").get(authorize, admin, getSingleUser);

module.exports = router;
