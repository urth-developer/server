var express = require('express');
var router = express.Router();
const challenge  = require('./challengeAPI')
router.use('/',challenge)
module.exports = router;