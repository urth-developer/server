const challengeModel = require("../models/challengeModel");
const userModel = require("../models/userModel");
const responseMessage = require("../module/responseMessage");
const statusCode = require("../module/statusCode");
const utils = require("../module/utils");
const jwt = require("../module/jwt");
const challengeController = {
  createChallenge: async (req, res, next) => {
    try {
      const { title, categoryIdx, explanation } = req.body;
      const image = req.file.location;
      /*****
       * express-validation 필요 ,Parameter에 대한 오류 처리
       */

      await challengeModel.insertChallenge(title, categoryIdx, explanation, image);
      res.json(utils.successTrue(statusCode.OK, responseMessage.CREATE_CHALLENGE_SUCCESS));
    } catch (error) {
      return next(500);
    }
  },

  searchTop10ChallengeList: async (req, res, next) => {
    try {
      const result = await challengeModel.searchTop10ChallengeList();

      res.json(
        utils.successTrue(
          statusCode.OK,
          responseMessage.SEARCH_TOP10_CHALLENGE_LIST_SUCCESS,
          result
        )
      );
    } catch (error) {
      return next(error);
    }
  },
  searchBookMarkChallengeList: async (req, res, next) => {
    try {
      const usrIdx = req.decoded.idx;
      const result = await challengeModel.searchBookMarkChallengeList(usrIdx);
      res.json(
        utils.successTrue(
          statusCode.OK,
          responseMessage.SEARCH_BOOKMARK_CHALLENGE_LIST_SUCCESS,
          result
        )
      );
    } catch (error) {
      return next(error);
    }
  },
  updateFavoriteChallengeOrder: async (req, res, next) => {},
  deleteTogetherChallenge: async (req, res, next) => {},
  insertTogetherChallenge: async (req, res, next) => {},
  searchTogetherChallenge: async (req, res, next) => {},

  postComment: async (req, res, next) => {
    try {
      // get userIdx
      const userIdx = req.decoded.idx;

      // get challengeIdx
      const challengeIdx = req.params.challengeIdx;
      const comment = req.body.comment;

      // write to db
      await challengeModel.createComment(userIdx, challengeIdx, comment);

      return res
        .status(200)
        .json(utils.successTrue(statusCode.OK, responseMessage.CREATE_COMMENT_SUCCESS));
    } catch (err) {
      return next(err);
    }
  },

  getComment: async (req, res, next) => {
    try {
      // get challengeIdx
      const challengeIdx = req.params.challengeIdx;

      // write to db
      const comments = await challengeModel.getCommentByChallengeIdx(challengeIdx);

      return res
        .status(200)
        .json(utils.successTrue(statusCode.OK, responseMessage.GET_COMMENT_SUCCESS, comments));
    } catch (err) {
      return next(err);
    }
  },

  detail: async (req, res, next) => {
    //challenge table: challengeIdx, name, explanation, image, count, category
    //user table: creator,
    //authChallenge table: totalSuccessCount, userSuccessCount, participantCount
    //, percentage(클라 계산), currentLevelCount, cuuserSuccessCount(카테고리별로 고정되어있음), participantCount
    try {
      const userIdx = req.decoded.idx;

      const challengeDetail = await challengeModel.findChallengeDetailByChallengeIdx(
        req.params.challengeIdx
      );

      const totalSuccessCount = challengeDetail.length;
      const participantArray = challengeDetail.map(elem => elem.participant);
      const userSuccessCount = challengeDetail.filter(elem => elem.participant === userIdx).length;
      const participantCount = [...new Set(participantArray)].length;

      const returnData = {
        ...challengeDetail[0],
        participant: undefined,
        totalSuccessCount,
        participantCount,
        userSuccessCount
      };

      return res
        .status(200)
        .json(
          utils.successTrue(statusCode.OK, responseMessage.GET_CHALLENGE_DETAIL_SUCCESS, returnData)
        );
    } catch (err) {
      return next(err);
    }
  },

  /***카테고리별 챌린지 리스트 조회 - 가인 ***/
  searchCategoryChallenge: async (req, res, next) => {
    // get all challenges that belong to a certain category
    const categoryIdx = req.params.categoryIdx;

    try {
      const challenges = await challengeModel.findAllChallengesWithSameCategory(categoryIdx);
      return res
        .status(200)
        .json(utils.successTrue(statusCode.OK, responseMessage.GET_USER_DATA_SUCCESS, challenges));
    } catch (err) {
      console.log(err);
      return res.status(200).json(utils.successFalse(statusCode.DB_ERROR, responseMessage.DB_ERR));
    }
  },

  keyword: async (req, res, next) => {
    try {
      const keywords = await challengeModel.findKeywords();
      return res
        .status(200)
        .json(utils.successTrue(statusCode.OK, responseMessage.GET_KEYWORDS_SUCCESS, keywords));
    } catch (err) {
      return next(err);
    }
  },

  search: async (req, res, next) => {
    try {
      const searchWord = req.body.searchWord;
      const challenges = await challengeModel.searchByWord(searchWord);
      throw new Error(500);
      return res
        .status(200)
        .json(
          utils.successTrue(
            statusCode.OK,
            responseMessage.GET_CHALLENGE_SEARCH_RESULT_SUCCESS,
            challenges
          )
        );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },

  summary: async (req, res, next) => {
    // get all challenges that belong to a certain category
    try {
      const authCountsByCategory = await challengeModel.groupChallengesByCategory();

      let totalSuccessCount = 0;
      for (let property in authCountsByCategory) {
        totalSuccessCount += authCountsByCategory[property];
      }

      const totalUserCount = await userModel.getUserCount();

      const returnData = { authCountsByCategory, totalSuccessCount, totalUserCount };

      return res
        .status(200)
        .json(utils.successTrue(statusCode.OK, responseMessage.GET_SUMMARY_SUCCESS, returnData));
    } catch (err) {
      return next(err);
    }
  }
};
module.exports = challengeController;
