var express = require("express");
var router = express.Router();
const signin = require("./signin");
const signup = require("./signup");
const user = require("./user/index");
const challenge = require("./challenge/index");

/* GET home page. */
router.use("/signin", signin);
router.use("/signup", signup);
router.use("/challenge", challenge);

module.exports = router;
