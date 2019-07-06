// Node Package Modules
var express = require("express");
var router = express.Router();

// DB connection
const pool = require("../config/dbConfig");

// Response Messages
const {
  CONNECTION_FAIL,
  QUERY_FAIL,
  CREATED_USER,
  ALREADY_USER,
  NULL_VALUE
} = require("../module/responseMessage");

// Status Codes
const {
  OK,
  BAD_REQUEST,
  CREATED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  DB_ERROR
} = require("../module/statusCode");

// Reponse Functions
const { successTrue, successFalse } = require("../module/utils");

// Routes
router.post("/", async (req, res) => {
  // read id, nickname, password, image from body
  const { id, nickname, password, image } = req.body;

  // check if there is same id or nickname

  const selectIdQuery = `SELECT * FROM user WHERE id='b'`;
  const result = await pool.query(selectIdQuery);

  console.log(result);

  if (result[0].length === 0) return console.log("no match");

  // if it is not unique, send an error message

  // if it is unique, hash the password

  // save it to DB and send success message
});

module.exports = router;
