const auth = require("../module/authUtils");
const urthInfoController = require("../controllers/urthInfoController")
module.exports =router =>{


    /******챌린지 건의 현황 정보 조회*/
    router.route('/settings/suggestion').get(auth.isLoggedin,urthInfoController.searchSuggestionChallengeList)

    
    /*****어스에 건의 하기 */
    router.route('/settings/report').post(auth.isLoggedin,urthInfoController.suggestForUrth)

    return router;
}