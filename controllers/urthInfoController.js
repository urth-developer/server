const responseMessage = require("../module/responseMessage");
const statusCode = require("../module/statusCode");
const utils = require("../module/utils");
const urthInfoModel = require('../models/urthInfoModel')

const urthInfoController = {

    searchSuggestionChallengeList : async (req, res, next) =>{

        try{
            const userIdx = req.decoded.idx 
            console.log(userIdx)
            const result = await urthInfoModel.SelectSuggestionChallengeList(userIdx)
            res.json(utils.successTrue(statusCode.OK,responseMessage.SEARCH_URTH_SUGGESTION_CHALLENGE_SUCCESS ,result))
        }
        catch(error)
        {
            return next(error)
        }
    },
    suggestForUrth : async (req,res,next)=>{

        try{
              /*****
               * express-validation 필요 ,Parameter에 대한 오류 처리
               */
            const userIdx = req.decoded.idx 
            const contents = req.body.contents
            await urthInfoModel.insertRequest(userIdx,contents)
            res.json(utils.successTrue(statusCode.OK,responseMessage.REQUEST_FOR_URTH_SUCCESS))
        }
        catch(error)
        {
            return next(error)
        }


    }

}
module.exports = urthInfoController