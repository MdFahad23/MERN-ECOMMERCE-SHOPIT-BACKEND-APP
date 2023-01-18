const router = require("express").Router();

const { signUp, signIn } = require("../controller/user.Controller");

router.route("/register").post(signUp);
router.route("/login").post(signIn);

module.exports = router;
