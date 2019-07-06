const db = require('../config/dbConfig')
const InsertChallengeQuery = 'INSERT INTO suggestionChallenge (name,categoryIdx,explanation,image) VALUES (?,?,?,?)'
const SelectTop10ChallengeQuery = ''
const SelectBookMarkChallengeQuery =''
const SelectThemeChallengeQuery =''
const SelectHotChallengeQuery =''




const challengeModel = {

    insertChallenge : async(name,categoryIdx,explanation,image)=>{
        try {

            const [rows] = await db.query(InsertChallengeQuery, [name,categoryIdx,explanation,image]);
            console.log(rows);
        
            } catch (e) {
            throw e;
        }
    
    
    }




} 
module.exports = challengeModel


