'use strict';

const challengeController  = require('../controllers/ChallengeController');
const upload = require('../config/multer')
const auth = require('../module/authUtils')
module.exports = (router) => {

  router.route('/challenge')
  .post(auth.isLoggedin,upload.single('image'),challengeController.createChallenge)
  router.route('/challenge/favorite')
  .get(auth.isLoggedin,challengeController.searchBookMarkChallengeList)
  router.route('/challenge/top10')
  .get(challengeController.searchTop10ChallengeList)


  return router;
};