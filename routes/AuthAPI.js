
const upload = require("../config/multer");
const auth = require("../module/authUtils");
const authController = require("../controllers/authController")
const multer = require('multer')
var storage = multer.memoryStorage()
var uploadMemory= multer({ storage: storage })
module.exports =router =>{


    /******챌린지 인증하기 */
    router.route('/auth').post(auth.isLoggedin,uploadMemory.single('image'),authController.authChallenge)

    /*****챌린지 인증 사진 중에서 이상한 사진 신고 */
    router.route('/auth/report').post(auth.isLoggedin,authController.reportChallengeImage)

    /*****신고 할 수 있는 챌린지 리스트 조회 */
    router.route('/auth/report/:challengeIdx').get(auth.isLoggedin,authController.searchReportImageList)

    /****인증 완료 결과에서 현재 해당 챌린지 인증 카운트 */
    router.route('/auth/result/:challengeIdx').get(auth.isLoggedin,authController.searchAuthResult)

    return router;
}