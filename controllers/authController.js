const responseMessage = require("../module/responseMessage");
const statusCode = require("../module/statusCode");
const utils = require("../module/utils");
const authModel = require("../models/authModel")


const AuthController = {

    authChallenge : async (req, res, next) => {





        
    },

    searchReportImageList : async (req, res, next) => {


        try{
            const challengeIdx = req.params.challengeIdx
            const result = await authModel.searchReportImageList(challengeIdx)
            res.json(utils.successTrue(statusCode.OK,responseMessage.SEARCH_REPORT_IMG_SUCCESS ,result[0]))
        }
        catch(error)
        {
            return next(error)
        }

    },

    reportChallengeImage : async (req, res, next) => {

        try{
            const {authChallengeIdx} = req.body
             /*****
              * express-validation 필요 ,Parameter에 대한 오류 처리
              */

            await authModel.updateReportImage(authChallengeIdx)
            res.json(utils.successTrue(statusCode.OK,responseMessage.REPORT_WRONG_IMG_SUCCESS))
    
            
            }
            catch(error)
                {    
                    return next(error)
                }
        

    }
}
module.exports = AuthController