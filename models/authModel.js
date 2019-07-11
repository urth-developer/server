const db = require('../config/dbConfig')

/***************/
const insertAuthChallengeQuery ="INSERT INTO authChallenge (userIdx,challengeIdx,image) VALUES (?,?,?)"
const updateReportImageQuery = "UPDATE authChallenge SET reportCount = reportCount +1 WHERE authChallengeIdx =?"
const selectReportImageListQuery  = "SELECT authChallengeIdx , userIdx , image FROM authChallenge where challengeIdx = ? and isWrong = 0 and userIdx != ? order by authChallengeIdx DESC limit 4;"
const selectChallengeMachineCategory = "SELECT machineLearningCategory.name , machineLearningCategoryIdx from challenge  inner join machineLearningCategory on challenge.machineLearningCategory = machineLearningCategory.machineLearningCategoryIdx  where challengeIdx =?"
/***************/ 
const challengeModel = {

    selectMachineCategoryByChallengeIdx : async(challengeIdx)=>{
        try{
            const result =await db.query(selectChallengeMachineCategory ,[challengeIdx])
            return result[0]
           }catch(e)
           {
               throw new Error(600)
           }
    },

    insertAuthChallenge : async(userIdx,challengeIdx,image)=>{
        try{
           await db.query(insertAuthChallengeQuery,[userIdx,challengeIdx,image])
          }catch(e)
          {
              console.log(e)
              throw new Error(600)
          }
    },

    searchReportImageList : async(challengeIdx,userIdx)=>{
        try{
           const result =  await db.query(selectReportImageListQuery,[challengeIdx,userIdx])
           return result
         }catch(e)
         {
             console.log(e)
             throw new Error(600)
         }
    },

    updateReportImage :async(authChallengeIdx)=>{
        try{
           
           await db.query(updateReportImageQuery,[authChallengeIdx])
                    
        }catch(e)
        {
            throw new Error(600)
        }

    }

}
module.exports = challengeModel