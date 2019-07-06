'use strict';

const challengeController  = require('../controllers/ChallengeController');
const upload = require('../config/multer')
const auth = require('../module/authUtils')
module.exports = (router) => {

  router.route('/challenge')
  .post(auth.isLoggedin,upload.single('image'),challengeController.createChallenge);

  router.route('/challenge/theme')
  .get(challengeController.searchThemeChallengeList)

  router.route('/challenge/favorite')
  .get(challengeController.searchBookMarkChallengeList)

  router.route('/challenge/hot')
  .get(challengeController.searchHotChallengeList)

  router.route('/challenge/top10')
  .get(challengeController.searchTop10ChallengeList)


  return router;
};