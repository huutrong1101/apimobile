var express = require("express");
var router = express.Router();
var { protect, authorize } = require(__path_middleware + "auth");

router.use("/product", require("./product"));
router.use("/category", require("./category"));
router.use("/users", protect, authorize("admin"), require("./user"));
router.use("/auth", require("./auth"));
router.use("/order", require("./order"));
router.use("/cart", require("./cart"));

module.exports = router;
