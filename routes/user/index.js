var express = require('express');
var router = express.Router();
const signin = require('./signin')
const signup = require('./signup')
router.use('/signin',signin)
router.use('/signup',signup)


module.exports = router;