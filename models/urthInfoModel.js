const db = require('../config/dbConfig')

/*********/
const InsertRequestQuery = "INSERT INTO userRequest (userIdx , contents) VALUES (?,?)"
const SelectSuggestionChallengeListQuery ="SELECT name , progressStatus FROM suggestionChallenge WHERE userIdx = ?"
/*********/

const urthInfoModel = {

    insertRequest : async(userIdx, contents)=>{

        try {
            await db.query(InsertRequestQuery, [userIdx,contents]);
           } catch (e) {
             throw new Error(600)
           }


    },
    SelectSuggestionChallengeList : async(userIdx)=>{

        try {
            await db.query(SelectSuggestionChallengeListQuery, [userIdx]);
           } catch (e) {
             throw new Error(600)
           }


    }








}
module.exports =urthInfoModel