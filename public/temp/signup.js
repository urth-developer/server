// Node Package Modules
var express = require("express");
var router = express.Router();

// DB connection
const pool = require("../../config/dbConfig");

// Response Messages & Status Codes
const message = require("../../module/responseMessage");
const statusCode = require("../../module/statusCode");

// Utility Functions
const { successTrue, successFalse } = require("../../module/utils");
const encryption = require("../../module/encryption");

// Validation
const validate = require("../../module/validate");

// Routes
router.post("/", async (req, res) => {
  // read id, nickname, password, image from body
  const user = req.body;
  const { id, nickname, password, image } = user;

  // Validation
  const { error } = validate.signup(user);
  if (error)
    return res.status(200).json(successFalse(statusCode.BAD_REQUEST, error.details[0].message));

  try {
    // check if there is same id
    const selectIdQuery = `SELECT * FROM user WHERE id=?`;
    const selectIdQueryResult = await pool.query(selectIdQuery, [id]);
    const duplicateId = selectIdQueryResult[0];
    const isDuplicateId = duplicateId.length > 0;

    if (isDuplicateId)
      return res.status(200).json(successFalse(statusCode.BAD_REQUEST, message.DUPLICATE_ID));

    // check if there is same nickname
    const selectNicknameQuery = `SELECT * FROM user WHERE nickname=?`;
    const selectNicknameQueryResult = await pool.query(selectNicknameQuery, [nickname]);
    const duplicateNickname = selectNicknameQueryResult[0];
    const isDuplicateNickname = duplicateNickname.length > 0;

    if (isDuplicateNickname)
      return res.status(200).json(successFalse(statusCode.BAD_REQUEST, message.DUPLICATE_NICKNAME));

    // if it is unique, hash the password
    const { cryptoPw, salt } = await encryption.asyncCipher(password);

    // save it to DB and send success message
    const insertUserQuery = "INSERT INTO user (id,nickname,password, salt) VALUES (?, ? ,? ,?)";
    await pool.query(insertUserQuery, [id, nickname, cryptoPw, salt]);
    return res.status(200).json(successTrue(statusCode.OK, message.SIGNUP_SUCCESS));
  } catch (err) {
    if ((err = "Encryption Error"))
      return res
        .status(200)
        .json(successFalse(statusCode.INTERNAL_SERVER_ERROR, message.HASHING_FAIL));
    return res.status(200).json(successFalse(statusCode.DB_ERROR, message.DB_ERR));
  }
});

module.exports = router;
