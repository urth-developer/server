"use strict";

const path = require("path");
const modulePath = path.join(__dirname, "../../module");
const responseMessage = require("../module/responseMessage.js");
const utils = require("../module/utils.js");
const statusCode = require("../module/statusCode.js");

// DB connection
const pool = require("../config/dbConfig");

// Response Messages & Status Codes
const message = require("../module/responseMessage");

// Utility Functions
const { successTrue, successFalse } = require("../module/utils");
const encryption = require("../module/encryption");

// Validation
const validate = require("../module/validate");

// Token function
const jwt = require("../module/jwt");

// User Model
const userModel = require("../models/UserModel");

const UserController = {
  signIn: async (req, res, next) => {
    // read id, nickname, password, image from request body
    const { id, password } = req.body;

    // Validation
    const { error } = validate.signin(req.body);
    if (error)
      return res.status(200).json(successFalse(statusCode.BAD_REQUEST, error.details[0].message));

    try {
      // check if id exists
      const user = await userModel.findById(id);
      if (!user)
        return res
          .status(200)
          .json(successFalse(statusCode.BAD_REQUEST, message.ID_OR_PW_WRO_VALUE));

      // check if the password is authentic by comparing with the hashed password in the db
      const isValidPassword = await encryption.asyncVerifyConsistency(
        password,
        user.salt,
        user.password
      );

      if (!isValidPassword)
        return res
          .status(200)
          .json(successFalse(statusCode.BAD_REQUEST, message.ID_OR_PW_WRO_VALUE));

      // Create JSON Web Token
      const result = jwt.sign(user.userIdx); // {token: <token string>}

      // send response
      const responseData = {
        ...result,
        userIdx: user.userIdx,
        nickname: user.nickname,
        level: user.level,
        experiencePoint: user.experiencePoint,
        profileImg: user.profileImg
      };
      return res.status(200).json(successTrue(statusCode.OK, message.SIGNIN_SUCCESS, responseData));
    } catch (err) {
      console.log(err);
      return res.status(200).json(successFalse(statusCode.DB_ERROR, message.DB_ERR));
    }
  },

  signUp: async (req, res, next) => {
    // read id, nickname, password, profileImg from body
    const { id, nickname, password, profileImg } = req.body;

    // Validation
    const { error } = validate.signup(input);
    if (error)
      return res.status(200).json(successFalse(statusCode.BAD_REQUEST, error.details[0].message));

    try {
      // check if there is same id
      const userWithSameId = await userModel.findById(id);
      if (userWithSameId)
        return res.status(200).json(successFalse(statusCode.BAD_REQUEST, message.DUPLICATE_ID));

      // check if there is same nickname
      const userWithSameNickname = await userModel.findByNickname(nickname);
      if (userWithSameNickname)
        return res
          .status(200)
          .json(successFalse(statusCode.BAD_REQUEST, message.DUPLICATE_NICKNAME));

      // if it is unique, hash the password
      const { cryptoPw, salt } = await encryption.asyncCipher(password);

      // save it to DB and send success message
      await userModel.create(id, nickname, cryptoPw, salt, profileImg);

      return res.status(200).json(successTrue(statusCode.OK, message.SIGNUP_SUCCESS));
    } catch (err) {
      if ((err = "Encryption Error"))
        return res
          .status(200)
          .json(successFalse(statusCode.INTERNAL_SERVER_ERROR, message.HASHING_FAIL));
      return res.status(200).json(successFalse(statusCode.DB_ERROR, message.DB_ERR));
    }
  },

  getUserData: async (req, res, next) => {
    // get userIdx, id, nickname, level, experiencePoint, profileImg from user table
    const user = await userModel.findByUserIdx(req.params.userIdx);

    console.log(user);
    const { userIdx, id, nickname, level, experiencePoint, profileImg } = user;

    // get category count from authChallenge and challenge joined table
    const userAuthCountsByCategory = await userModel.getUserAuthCountsByCategoryByUserIdx(userIdx);
    console.log(userAuthCountsByCategory);

    const userSuccessCount = userAuthCountsByCategory.reduce((acc, elem) => acc + elem);
    console.log(userSuccessCount);

    // create response data

    const responseData = {
      userIdx,
      id,
      nickname,
      level,
      experiencePoint,
      profileImg,
      userAuthCountsByCategory,
      userSuccessCount
    };

    // send response
    return res
      .status(200)
      .json(successTrue(statusCode.OK, message.GET_USER_DATA_SUCCESS, responseData));
  }
};

module.exports = UserController;
