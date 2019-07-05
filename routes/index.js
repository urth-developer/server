var express = require('express');
var router = express.Router();
const user = require('./user/index')
router.use('/',user)

module.exports = router;
