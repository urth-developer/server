const db = require('../config/dbConfig')

/***************/
const insertAuthChallengeQuery ="INSERT INTO authChallenge (userIdx,challengeIdx,image) VALUES (?,?,?)"
const updateReportImageQuery = "UPDATE authChallenge SET reportCount =  reportCount +1 WHERE authChallengeIdx =?"
const selectReportImageListQuery  = "SELECT authChallengeIdx , uerIdx , image FROM authChallenge where challengeIdx = ? and isWrong = 0 order by authChallengeIdx DESC limit 4;"
/***************/
const challengeModel = {

    insertAuthChallenge : async(userIdx,challengeIdx,image)=>{
        try{
           await db.query(insertAuthChallengeQuery,[userIdx,challengeIdx,image])
          }catch(e)
          {
              throw new Error(600)
          }
    },

    searchReportImageList : async(challengeIdx)=>{
        try{
           const result =  await db.query(selectReportImageListQuery,[challengeIdx])
           return result
         }catch(e)
         {
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