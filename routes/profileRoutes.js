const router = require("express").Router();
const { getProfile, setProfile } = require("../controller/profile.Controller");
const authorize = require("../middleware/authorize");

router.route("/").get(authorize, getProfile).post(authorize, setProfile);

module.exports = router;
