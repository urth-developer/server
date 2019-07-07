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

// ===============================================================

// Routes
router.get("/:categoryIdx", async (req, res) => {
  // get all challenges that belong to a certain category
  const categoryIdx = req.params.categoryIdx;
  const selectAllChallengesWithSameCategoryQuery =
    "SELECT * FROM challenge WHERE category=?";

  try {
    const selectAllChallengesWithSameCategoryQueryResult = await pool.query(
      selectAllChallengesWithSameCategoryQuery,
      [categoryIdx]
    );
    const responseData = selectAllChallengesWithSameCategoryQueryResult[0];
    // send response
    return res
      .status(200)
      .json(
        successTrue(statusCode.OK, message.GET_USER_DATA_SUCCESS, responseData)
      );
  } catch {
    console.log(err);
    return res
      .status(200)
      .json(successFalse(statusCode.DB_ERROR, message.DB_ERR));
  }
});

module.exports = router;
