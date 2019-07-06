// Node Package Modules
var express = require("express");
var router = express.Router();

// DB connection
const pool = require("../config/dbConfig");

// Response Messages & Status Codes
const message = require("../module/responseMessage");
const statusCode = require("../module/statusCode");

// Utility Functions
const { successTrue, successFalse } = require("../module/utils");
const encryption = require("../module/encryption");

// Validation
const validate = require("../module/validate");

// Token function
const jwt = require("../module/jwt");

// ===============================================================

// Routes
router.post("/", async (req, res) => {
  // Validation
  const { error } = validate.signin(req.body);
  if (error)
    return res
      .status(200)
      .json(successFalse(statusCode.BAD_REQUEST, error.details[0].message));

  try {
    // check if id exists
    const selectIdQuery = `SELECT * FROM user WHERE id=?`;
    const selectIdQueryResult = await pool.query(selectIdQuery, [req.body.id]);
    const user = selectIdQueryResult[0][0];

    if (!user)
      return res
        .status(200)
        .json(successFalse(statusCode.BAD_REQUEST, message.ID_OR_PW_WRO_VALUE));

    console.log(req.body);

    // check if the password is authentic by comparing with the hashed password in the db
    const isValidPassword = await encryption.asyncVerifyConsistency(
      req.body.password,
      user.salt,
      user.password
    );

    if (!isValidPassword)
      return res
        .status(200)
        .json(successFalse(statusCode.BAD_REQUEST, message.ID_OR_PW_WRO_VALUE));

    // Create JSON Web Token
    const result = jwt.sign(user.userIdx); // {token: <token string>}

    // Response with token
    return res
      .status(200)
      .json(successTrue(statusCode.OK, message.SIGNIN_SUCCESS, result));
  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .json(successFalse(statusCode.DB_ERROR, message.DB_ERR));
  }
});

module.exports = router;
