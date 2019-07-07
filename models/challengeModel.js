const db = require('../config/dbConfig')
const InsertChallengeQuery = 'INSERT INTO suggestionChallenge (name,category,explanation,image) VALUES (?,?,?,?)'
const SelectTop10ChallengeQuery = 'SELECT * FROM challenge ORDER BY count DESC LIMIT 10'
const SelectBookMarkChallengeQuery ='SELECT * FROM BookmarkChallenge  natural JOIN challenge WHERE userIdx = ? ORDER BY favoriteOrder DESC'

/**********/
const InsertTogetherChallengeQuery = "INSERT INTO ongoingChallenge (userIdx , challengeIdx) VALUES (?,?)"
const SelectTogetherChallengeQuery = "SELECT  ongoingChallenge.challengeIdx , name , challenge.image , count(authChallengeIdx) as count FROM ongoingChallenge natural join challenge left join authChallenge on ongoingChallenge.challengeIdx = authChallenge.challengeIdx where ongoingChallenge.userIdx = ? group by ongoingChallenge.challengeIdx"
const DeleteTogetherChallengeQuery = "DELETE FROM ongoingChallenge WHERE userIdx = ? and challengeIdx =?"
const UPDATEBookMarkChallengeQuery = "UPDATE  BookmarkChallenge SET favoriteOrder = ? WHERE userIdx = ?  AND challengeIdx =?"
/**********/





const challengeModel = {

    insertChallenge : async(name,categoryIdx,explanation,image)=>{
        try {
             await db.query(InsertChallengeQuery, [name,categoryIdx,explanation,image]);
            } catch (e) {
              throw new Error(500)
            }
    
    
    },
    SearchBookMarkChallengeList : (userIdx)=>{

        try{
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

    
    },
    UpdateFavoriteChallengeOrder : async(userIdx,favoriteChallengeList)=>{

        try{

            for(let i = 0 ; i < favoriteChallengeList.length ;i++)
            {
                await db.query(UPDATEBookMarkChallengeQuery,[favoriteChallengeList[i].favoriteOrder,userIdx,favoriteChallengeList[i].challengeIdx])
            }


        }catch(e)
        {
            throw new Error(500)
        }






    },
    InsertTogetherChallenge : async(userIdx,challengeIdx)=>{

        try{

            const result =  await db.query(InsertTogetherChallengeQuery,[userIdx,challengeIdx])
            return result;
   
           }catch (e)
           {
               throw new Error(500)
           }

    },
    DeleteTogetherChallenge : async(userIdx,challengeIdx)=>{

        try{
            const result =  await db.query(DeleteTogetherChallengeQuery,[userIdx,challengeIdx])
            return result;
   
           }catch (e)
           {
               throw new Error(500)
           }

    },

    SearchTogetherChallengeList : async(userIdx)=>{

        try{

            const result =  await db.query(SelectTogetherChallengeQuery,[userIdx])
            return result;
   
           }catch (e)
           {
               throw new Error(500)
           }

    }
    




} 
module.exports = challengeModel


