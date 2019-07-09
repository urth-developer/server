"use strict";

const path = require("path");
const modulePath = path.join(__dirname, "../../module");
const utils = require("../module/utils.js");
const statusCode = require("../module/statusCode.js");

// DB connection
const pool = require("../config/dbConfig");

// Response Messages & Status Codes
const responseMessage = require("../module/responseMessage");

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
    try {
      // read id, nickname, password, image from request body
      const { id, password } = req.body;

      // Validation
      const { error } = validate.signin(req.body);
      if (error)
        return res.status(200).json(successFalse(statusCode.BAD_REQUEST, error.details[0].message));

      // check if id exists
      const user = await userModel.findById(id);
      if (!user)
        return res
          .status(200)
          .json(successFalse(statusCode.BAD_REQUEST, responseMessage.ID_OR_PW_WRO_VALUE));

      // check if the password is authentic by comparing with the hashed password in the db
      const isValidPassword = await encryption.asyncVerifyConsistency(
        password,
        user.salt,
        user.password
      );

      if (!isValidPassword)
        return res
          .status(200)
          .json(successFalse(statusCode.BAD_REQUEST, responseMessage.ID_OR_PW_WRO_VALUE));

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
      return res
        .status(200)
        .json(successTrue(statusCode.OK, responseMessage.SIGNIN_SUCCESS, responseData));
    } catch (error) {
      return next(error);
    }
  },

  signUp: async (req, res, next) => {
    try {
      // read id, nickname, password, profileImg from body
      const { id, nickname, password, profileImg } = req.body;

      // Validation
      const { error } = validate.signup(req.body);
      if (error)
        return res.status(200).json(successFalse(statusCode.BAD_REQUEST, error.details[0].message));

      // check if there is same id
      const userWithSameId = await userModel.findById(id);
      if (userWithSameId)
        return res
          .status(200)
          .json(successFalse(statusCode.BAD_REQUEST, responseMessage.DUPLICATE_ID));

      // check if there is same nickname
      const userWithSameNickname = await userModel.findByNickname(nickname);
      if (userWithSameNickname)
        return res
          .status(200)
          .json(successFalse(statusCode.BAD_REQUEST, responseMessage.DUPLICATE_NICKNAME));

      // if it is unique, hash the password
      const { cryptoPw, salt } = await encryption.asyncCipher(password);

      // save it to DB and send success message
      await userModel.create(id, nickname, cryptoPw, salt, profileImg);

      return res.status(200).json(successTrue(statusCode.OK, responseMessage.SIGNUP_SUCCESS));
    } catch (error) {
      return next(error);
    }
  },

  getUserData: async (req, res, next) => {
    try {
      const userIdx = req.decoded.idx;
      console.log(userIdx);

      const user = await userModel.findByUserIdx(userIdx);

      const { id, nickname, level, experiencePoint, profileImg } = user;

      // get category count from authChallenge and challenge joined table
      let userAuthCountsByCategory = await userModel.getUserAuthCountsByCategoryByUserIdx(userIdx);
      console.log(userAuthCountsByCategory);

      let userSuccessCount = 0;
      for (let property in userAuthCountsByCategory) {
        userSuccessCount += userAuthCountsByCategory[property];
      }

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
        .json(successTrue(statusCode.OK, responseMessage.GET_USER_DATA_SUCCESS, responseData));
    } catch (error) {
      return next(error);
    }
  },

  getTimeline: async (req, res, next) => {
    try {
      // get userIdx from token
      const userIdx = req.decoded.idx;
      console.log(userIdx);

      // authChallengeIdx, userIdx, challengeIdx, image, time

      // get category count from authChallenge and challenge joined table
      const timeline = await userModel.findAuthChallengeByUserIdx(userIdx);
      console.log(timeline);

      // send response
      return res
        .status(200)
        .json(successTrue(statusCode.OK, responseMessage.GET_TIMELINE_SUCCESS, timeline));
    } catch (error) {
      return next(error);
    }
  },

  searchFriend: async (req, res, next) => {
    try {
      // get userIdx from token
      const userIdx = req.decoded.idx;
      console.log(userIdx);

      // get nickname from params
      const nicknameToSearch = req.params.nickname;

      // search the nickname
      const searchResult = await userModel.findByNickname(nicknameToSearch);
      if (!searchResult)
        return res
          .status(200)
          .json(successFalse(statusCode.NOT_FOUND, responseMessage.NO_FRIEND_SEARCH_RESULT));

      const friendIdx = searchResult.userIdx;

      // check for friendship
      let friendship = false;
      const alreadyFriends = await userModel.checkFriendship(userIdx, friendIdx);
      if (alreadyFriends) friendship = true;

      const responseData = {
        ...searchResult,
        id: undefined,
        password: undefined,
        salt: undefined,
        experiencePoint: undefined,
        friendship
      };

      // send response
      return res
        .status(200)
        .json(successTrue(statusCode.OK, responseMessage.FRIEND_SEARCH_SUCCESS, responseData));
    } catch (error) {
      return next(error);
    }
  },

  addFriend: async (req, res, next) => {
    try {
      // get userIdx from token
      const userIdx = req.decoded.idx;

      // get userIdx to add from params
      const friendIdx = req.params.userIdx;

      // check for friendship
      const alreadyFriends = await userModel.checkFriendship(userIdx, friendIdx);
      if (alreadyFriends)
        return res
          .status(200)
          .json(successFalse(statusCode.BAD_REQUEST, responseMessage.ALREADY_FRIENDS));

      // add friend
      await userModel.addFriendByUserIdx(userIdx, friendIdx);

      // send response
      return res.status(200).json(successTrue(statusCode.OK, responseMessage.FRIEND_ADD_SUCCESS));
    } catch (error) {
      return next(error);
    }
  },

  getFriendList: async (req, res, next) => {
    try {
      // get userIdx from token
      const userIdx = req.decoded.idx;

      // get friend list
      const friendList = await userModel.findAllFriendsByUserIdx(userIdx);
      if (friendList.length === 0)
        return res
          .status(200)
          .json(successFalse(statusCode.NO_CONTENT, responseMessage.NO_FRIENDS));

      // send response
      return res
        .status(200)
        .json(successTrue(statusCode.OK, responseMessage.GET_FRIEND_LIST_SUCCESS, friendList));
    } catch (error) {
      return next(error);
    }
  },

  getFriendData: async (req, res, next) => {
    try {
      const friendIdx = req.params.userIdx;

      const user = await userModel.findByUserIdx(friendIdx);

      const { id, nickname, level, experiencePoint, profileImg } = user;

      // get category count from authChallenge and challenge joined table
      let userAuthCountsByCategory = await userModel.getUserAuthCountsByCategoryByUserIdx(
        friendIdx
      );
      console.log(userAuthCountsByCategory);

      let userSuccessCount = 0;
      for (let property in userAuthCountsByCategory) {
        userSuccessCount += userAuthCountsByCategory[property];
      }

      // create response data

      const responseData = {
        userIdx: friendIdx,
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
        .json(successTrue(statusCode.OK, responseMessage.GET_FRIEND_DATA_SUCCESS, responseData));
    } catch (error) {
      return next(error);
    }
  },

  getFriendTimeline: async (req, res, next) => {
    try {
      const friendIdx = req.params.userIdx;
      // authChallengeIdx, userIdx, challengeIdx, image, time

      // get category count from authChallenge and challenge joined table
      const timeline = await userModel.findAuthChallengeByUserIdx(friendIdx);
      console.log(timeline);

      // send response
      return res
        .status(200)
        .json(successTrue(statusCode.OK, responseMessage.GET_FRIEND_TIMELINE_SUCCESS, timeline));
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = UserController;
