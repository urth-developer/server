"use strict";

const challengeController = require("../controllers/challengeController");
const upload = require("../config/multer");
const auth = require("../module/authUtils");
module.exports = router => {
  router
    .route("/challenge")
    .post(auth.isLoggedin, upload.single("image"), challengeController.createChallenge);
  router
    .route("/challenge/favorite")
    .get(auth.isLoggedin, challengeController.searchBookMarkChallengeList);
  router.route("/challenge/top10").get(challengeController.searchTop10ChallengeList);

  /***즐겨찾기 챌린지 순서 바꾸기***/
  router
    .route("/challenge/favorite")
    .put(auth.isLoggedin, challengeController.updateFavoriteChallengeOrder);

  /***함께하기 한 챌린지 포기 ***/
  router
    .route("/challenge/together")
    .delete(auth.isLoggedin, challengeController.deleteTogetherChallenge);

  /***함께하기 챌린지 추가***/
  router
    .route("/challenge/together")
    .post(auth.isLoggedin, challengeController.insertTogetherChallenge);

  /***함께하기 챌린지 리스트 조회***/
  router
    .route("/challenge/together")
    .get(auth.isLoggedin, challengeController.searchTogetherChallenge);

  /***카테고리별 챌린지 리스트 조회***/
  router.route("/challenge/category/:categoryIdx").get(challengeController.searchCategoryChallenge);

  /***어스 성과 요약***/
  router.route("/challenge/summary").get(challengeController.summary);

  /***검색 키워드 리스트 조회***/
  router.route("/challenge/keyword").get(challengeController.keyword);

  /***검색한 챌린지 리스트 조회***/
  router.route("/challenge/search").get(challengeController.search);

  /***챌린지 상세보기***/
  router.route("/challenge/:challengeIdx").get(auth.isLoggedin, challengeController.detail);

  /***챌린지 한줄 응원 등록***/
  router
    .route("/challenge/comment/:challengeIdx")
    .post(auth.isLoggedin, challengeController.postComment);

  /***챌린지 한줄 응원 리스트 조회***/
  router
    .route("/challenge/comment/:challengeIdx")
    .get(auth.isLoggedin, challengeController.getComment);

  return router;
};
