var express = require("express");
var router = express.Router();
const signin = require("./signin");
const signup = require("./signup");
const summary = require("./summary");
const challenge = require("./challenge/index");
const user = require("./user/index");

/* GET home page. */
router.use("/signin", signin);
router.use("/signup", signup);
router.use("/summary", summary);
router.use("/challenge", challenge);
router.use("/user", user);

module.exports = router;
