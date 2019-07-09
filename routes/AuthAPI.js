
const upload = require("../config/multer");
const auth = require("../module/authUtils");
const authController = require("../controllers/authController")
module.exports =router =>{


    /******챌린지 인증하기 */
    router.route('/auth').post(auth.isLoggedin,authController.authChallenge)

    /*****챌린지 인증 사진 중에서 이상한 사진 신고 */
    router.route('/auth/report').post(auth.isLoggedin,authController.reportChallengeImage)

    /*****신고 할 수 있는 챌린지 리스트 조회 */
    router.route('/auth/report/:challengeIdx').get(auth.isLoggedin,authController.searchReportImageList)

    return router;
}