
const challengeModel =  require('../models/challengeModel')

const challengeController ={

    createChallenge :async (req,res,next)=>{

        try{
        const {title, categoryIdx ,explanation} = req.body;
        const image = req.file.location;
        /*****
         * express-validation 필요 ,Parameter에 대한 오류 처리
         */
        const result = await challengeModel.insertChallenge(title,categoryIdx,explanation,image)
        }
        catch(e)
        {


        }

    },

    searchTop10ChallengeList :async (next)=>{


    },

    searchThemeChallengeList : async(next)=>{

    },

    searchHotChallengeList : async(next)=>{


    },

    searchBookMarkChallengeList : async(userIdx)=>{



    }
}
module.exports = challengeController