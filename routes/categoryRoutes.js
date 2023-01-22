const router = require("express").Router();

const {
  createCategory,
  getCategorise,
} = require("../controller/category.Controller");
const authorize = require("../middleware/authorize");
const admin = require("../middleware/admin");

router.route("/admin/createCategory").post(authorize, admin, createCategory);
router.route("/").get(getCategorise);

module.exports = router;
