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

// Token function
const jwt = require("../../module/jwt");

// ===============================================================

// Routes
router.get("/:userIdx", async (req, res) => {
  // Verify Token
  const token = req.header("Authorization");
  try {
    jwt.verify(token);
  } catch (err) {
    return res
      .status(200)
      .json(successFalse(statusCode.UNAUTHORIZED, message.INVALID_TOKEN));
  }

  // get userIdx, id, nickname, level, experiencePoint, profileImg from user table
  const userIdx = req.params.userIdx;
  const selectUserQuery = "SELECT * FROM user WHERE userIdx=?";
  const selectUserQueryResult = await pool.query(selectUserQuery, [userIdx]);
  const user = selectUserQueryResult[0][0];

  console.log(user);
  const { id, nickname, level, experiencePoint, profileImg } = user;

  // get category count from authChallenge and challenge joined table
  const getAllCategoriesQuery =
    "SELECT category, COUNT(*) AS categoryCount FROM authChallenge natural join challenge where userIdx=? GROUP BY category";
  const getAllCategoriesQueryResult = await pool.query(getAllCategoriesQuery, [
    userIdx
  ]);

  const categoryCount = getAllCategoriesQueryResult[0].map(
    elem => elem.categoryCount
  );

  const userSuccessCount = categoryCount.reduce((acc, elem) => acc + elem);

  // create response data

  const responseData = {
    userIdx,
    id,
    nickname,
    level,
    experiencePoint,
    profileImg,
    categoryCount,
    userSuccessCount
  };

  // send response
  return res
    .status(200)
    .json(
      successTrue(statusCode.OK, message.GET_USER_DATA_SUCCESS, responseData)
    );
});

module.exports = router;
