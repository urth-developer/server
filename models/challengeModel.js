const path =  require('path')
const configPath = path.join(__dirname,'../config')
const db = require(modulePath,'/dbConfig')

const InsertChallengeQuery = 'INSERT INTO suggestionChallenge (name,categoryIdx,explanation,image) VALUES (?,?,?,?)'
const SelectTop10ChallengeQuery = ''
const SelectBookMarkChallengeQuery =''
const SelectThemeChallengeQuery =''
const SelectHotChallengeQuery =''




const challengeModel = {

    insertChallenge : async(name,categoryIdx,explanation,image,next)=>{

        




    }




} 
module.exports = challengeModel


