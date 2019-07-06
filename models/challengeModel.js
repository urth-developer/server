const db = require('../config/dbConfig')
const InsertChallengeQuery = 'INSERT INTO suggestionChallenge (name,categoryIdx,explanation,image) VALUES (?,?,?,?)'
const SelectTop10ChallengeQuery = 'SELECT * FROM challenge where '
const SelectBookMarkChallengeQuery ='SELECT * FROM BookmarkChallenge JOIN challenge ON`````````````````````````````````````````````````````````````````````````````````````````````````````'
const SelectThemeChallengeQuery =''
const SelectHotChallengeQuery =''




const challengeModel = {

    insertChallenge : async(name,categoryIdx,explanation,image,next)=>{
        try {
            const [rows] = await db.query(InsertChallengeQuery, [name,categoryIdx,explanation,image]);
            if(rows.length == 0)
                throw new Error(500)

        
            } catch (e) {
              throw new Error(500)
            }
    
    
    },
    SearchHotChallengeList : (next)=>{


    },
    SearchBookMarkChallengeList : ()=>{


    },
    SearchThemeChallengeList : ()=>{

    },
    SearchTop10ChallengeList : async()=>{

    
    }




} 
module.exports = challengeModel


