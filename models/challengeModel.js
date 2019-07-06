const db = require('../config/dbConfig')
const InsertChallengeQuery = 'INSERT INTO suggestionChallenge (name,categoryIdx,explanation,image) VALUES (?,?,?,?)'
const SelectTop10ChallengeQuery = 'SELECT * FROM challenge ORDER BY count DESC LIMIT 10'
const SelectBookMarkChallengeQuery ='SELECT * FROM BookmarkChallenge  natural JOIN challenge WHERE userIdx = ? ORDER BY favoriteOrder DESC'




const challengeModel = {

    insertChallenge : async(name,categoryIdx,explanation,image,next)=>{
        try {
             await db.query(InsertChallengeQuery, [name,categoryIdx,explanation,image]);
        
            } catch (e) {
              throw new Error(500)
            }
    
    
    },
    SearchBookMarkChallengeList : (userIdx)=>{

        try{
            const user = req.decode
            const result = db.query(SelectBookMarkChallengeQuery,[userIdx])
            return result
        }catch(e)
        {
            throw new Error(500)
        }

    },
    SearchTop10ChallengeList : async()=>{
        try{

         const result =  await db.query(SelectTop10ChallengeQuery)
         return result;

        }catch (e)
        {
            throw new Error(500)
        }

    
    }




} 
module.exports = challengeModel


