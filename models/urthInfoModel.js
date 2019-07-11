const db = require('../config/dbConfig')

/*********/
const InsertRequestQuery = "INSERT INTO userRequest (userIdx , contents) VALUES (?,?)"
const SelectSuggestionChallengeListQuery ="SELECT suggestionChallengeIdx,createTime, name , progressStatus,image FROM suggestionChallenge WHERE creator = ?"
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
            const result =await db.query(SelectSuggestionChallengeListQuery, [userIdx]);
            return result[0]
           } catch (e) {
             console.log(e)
             throw new Error(600)
           }


    }








}
module.exports =urthInfoModel