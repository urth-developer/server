var express = require("express");
var router = express.Router();
const challenge = require("./challengeAPI");
const category = require("./category");
router.use("/", challenge);
router.use("/category", category);
module.exports = router;
