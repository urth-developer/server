const path = require('path')
const controllerPath = path.join(__dirname,'../controllers')
const challengeModel =  require(path.join(controllerPath,'/challengeModel'))

const challengeController ={

    createChallenge :async (req,res,next)=>{


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