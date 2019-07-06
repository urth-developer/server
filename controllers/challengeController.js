
const challengeModel =  require('../models/challengeModel')
const responseMessage = require('../module/responseMessage')
const statusCode = require('../module/statusCode')
const utils = require('../module/utils')
const challengeController ={

    createChallenge :async (req,res,next)=>{

        try{
        const {title, categoryIdx ,explanation} = req.body;
        const image = req.file.location;
        /*****
         * express-validation 필요 ,Parameter에 대한 오류 처리
         */

        const result = await challengeModel.insertChallenge(title,categoryIdx,explanation,image,next)
        utils.successTrue(statusCode.OK,responseMessage.CREATE_CHALLENGE_SUCCESS)
        }
        catch(error)
        {    
            return next(500)
        }

    },

    searchTop10ChallengeList :async (req,res,next)=>{

    try{

        await challengeModel.searchTop10ChallengeList()

    }
    catch(error)
        {    
            return next(error)
        }

    },

    searchThemeChallengeList : async(req,res,next)=>{


        try{


        }
        catch(error)
            {    
                return next(error)
            }
    
    },

    searchHotChallengeList : async(req,res,next)=>{


        try{


        }
        catch(error)
            {    
                return next(error)
            }
    
    },

    searchBookMarkChallengeList : async(req,res,next)=>{


        try{


        }
        catch(error)
            {    
                return next(error)
            }
    

    }
}
module.exports = challengeController