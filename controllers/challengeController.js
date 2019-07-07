
const challengeModel =  require('../models/challengeModel')
const responseMessage = require('../module/responseMessage')
const statusCode = require('../module/statusCode')
const utils = require('../module/utils')
const jwt = require('../module/jwt')
const challengeController ={

    createChallenge :async (req,res,next)=>{

        try{
        const {title, categoryIdx ,explanation} = req.body;
        const image = req.file.location;
        /*****
         * express-validation 필요 ,Parameter에 대한 오류 처리
         */



        await challengeModel.insertChallenge(title,categoryIdx,explanation,image)
        res.json(utils.successTrue(statusCode.OK,responseMessage.CREATE_CHALLENGE_SUCCESS))
        }
        catch(error)
        {    
            return next(500)
        }
    },

    searchTop10ChallengeList :async (req,res,next)=>{

    try{

        const result = await challengeModel.searchTop10ChallengeList()


        res.json(utils.successTrue(statusCode.OK,responseMessage.SEARCH_TOP10_CHALLENGE_LIST_SUCCESS,result))
    }
    catch(error)
        {    
            return next(error)
        }

    },
    searchBookMarkChallengeList : async(req,res,next)=>{
        try{
        const usrIdx = req.decoded.idx 
        const result = await challengeModel.searchBookMarkChallengeList(usrIdx)
        res.json(utils.successTrue(statusCode.OK,responseMessage.SEARCH_BOOKMARK_CHALLENGE_LIST_SUCCESS,result))

        
        }
        catch(error)
            {    
                return next(error)
            }
    

    },
    updateFavoriteChallengeOrder : async(req,res,next)=>{


        try{
     /*****
         * express-validation 필요 ,Parameter에 대한 오류 처리
         */
        const userIdx = req.decoded.idx 
        const favoriteChallengeList = req.body.favoriteChallengeList
        await challengeModel.UpdateFavoriteChallengeOrder(userIdx,favoriteChallengeList)
        res.json(utils.successTrue(statusCode.OK,responseMessage.UPDATE_BOOKMARK_CHALLENGE_SUCCESS))
        }
        catch(error)
        {

            return next(error)

        }


    },
    deleteTogetherChallenge :async(req,res,next)=>{

        try{

            /*****
             * express-validation 필요 ,Parameter에 대한 오류 처리
             */
            const usrIdx = req.decoded.idx
            const challengeIdx = req.body.challengeIdx
    
            await challengeModel.DeleteTogetherChallenge(usrIdx,challengeIdx)
            res.json(utils.successTrue(statusCode.OK,responseMessage.DeleteTogetherChallenge))
            }
            catch(error)
            {
    
                return next(error)
                
            }


    },
    insertTogetherChallenge :async(req,res,next)=>{

        try{

        /*****
         * express-validation 필요 ,Parameter에 대한 오류 처리
         */
        const usrIdx = req.decoded.idx
        const challengeIdx = req.body.challengeIdx

        await challengeModel.InsertTogetherChallenge(usrIdx,challengeIdx)
        res.json(utils.successTrue(statusCode.OK,responseMessage.INSERT_TOGETHER_CHALLENGE_SUCCESS))
        }
        catch(error)
        {

            return next(error)
            
        }


    },
    searchTogetherChallenge:async(req,res,next)=>{

        try{
            const usrIdx = req.decoded.idx

            await challengeModel.searchTogetherChallenge()

            res.json(utils.successTrue(statusCode.OK,responseMessage.SEARCH_TOGETHER_CHALLENGE_LIST_SUCCESS))
        }
        catch(error)
        {

            return next(error)
            
        }


    }
}
module.exports = challengeController