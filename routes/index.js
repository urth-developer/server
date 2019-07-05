var express = require("express");
var router = express.Router();

/* GET home page. */
router.use("/signin", require("./signin.js"));
router.use("/signin", require("./signup.js"));

module.exports = router;
