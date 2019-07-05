var express = require('express');
var router = express.Router();
const user = require('./user/index')
const challenge = require('./challenge/index')
router.use('/',user)
router.use('/challenge',challenge)

module.exports = router;
