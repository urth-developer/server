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

// Token
const jwt = require("jsonwebtoken");

// ===============================================================

// Routes
router.post("/", async (req, res) => {
  // Validation
  const { error } = validate.signup(req.body);
  if (error)
    return res
      .status(200)
      .json(successFalse(statusCode.BAD_REQUEST, error.details[0].message));

  try {
    // check if id exists
    const selectIdQuery = `SELECT * FROM user WHERE id=?`;
    const selectIdQueryResult = await pool.query(selectIdQuery, [req.body.id]);
    const user = selectIdQueryResult[0];

    if (!user)
      return res
        .status(200)
        .json(successFalse(statusCode.BAD_REQUEST, message.ID_OR_PW_WRO_VALUE));

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
    const token = jwt.sign({ userIdx: user.userIdx });

    // Response with token

    // save it to DB and send success message
    const insertUserQuery =
      "INSERT INTO user (id,nickname,password, salt) VALUES (?, ? ,? ,?)";
    await pool.query(insertUserQuery, [id, nickname, cryptoPw, salt]);
    return res
      .status(200)
      .json(successTrue(statusCode.OK, message.SIGNUP_SUCCESS));
  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .json(successFalse(statusCode.DB_ERROR, message.DB_ERR));
  }
});

module.exports = router;
