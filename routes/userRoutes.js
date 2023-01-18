const router = require("express").Router();

const { signUp, signIn } = require("../controller/user.Controller");
const upload = require("../middleware/multer");

router.route("/register").post(upload, signUp);
router.route("/login").post(signIn);

module.exports = router;
