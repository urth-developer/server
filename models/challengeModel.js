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
const InsertChallengeQuery =
  "INSERT INTO suggestionChallenge (name,category,explanation,image) VALUES (?,?,?,?)";
const SelectTop10ChallengeQuery = "SELECT * FROM challenge ORDER BY count DESC LIMIT 10";
const SelectBookMarkChallengeQuery =
  "SELECT * FROM BookmarkChallenge  natural JOIN challenge WHERE userIdx = ? ORDER BY favoriteOrder DESC";





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

    },

  findAllChallengesWithSameCategory: async categoryIdx => {
    const selectAllChallengesWithSameCategoryQuery = "SELECT * FROM challenge WHERE category=?";

    try {
      const [challenges] = await db.query(selectAllChallengesWithSameCategoryQuery, [categoryIdx]);
      return challenges;
    } catch (e) {
      throw new Error(500);
    }
  },
  groupChallengesByCategory: async () => {
    const groupChallengesByCategoryQuery =
      "SELECT COUNT(*) AS categoryCount FROM authChallenge natural join challenge GROUP BY category";

    try {
      let [challengesCountByCategory] = await db.query(groupChallengesByCategoryQuery);
      challengesCountByCategory = challengesCountByCategory.map(elem => elem.categoryCount);
      return challengesCountByCategory;
    } catch (e) {
      throw new Error(500);
    }
  },
  findKeywords: async () => {
    const selectAllKeywordsQuery = "SELECT * FROM searchKeywords";

    try {
      let [keywords] = await db.query(selectAllKeywordsQuery);
      return keywords;
    } catch (e) {
      throw new Error(500);
    }
  },

  findChallengeDetailByChallengeIdx: async challengeIdx => {
    const selectChallengeQuery =
      "SELECT nickname AS creator, challenge.challengeIdx, authChallenge.userIdx AS participant, name, explanation, challenge.image, count, category FROM challenge INNER JOIN authChallenge ON challenge.challengeIdx=authChallenge.challengeIdx INNER JOIN user ON challenge.creator=user.userIdx WHERE challenge.challengeIdx=2";
    try {
      let [challengeDetail] = await db.query(selectChallengeQuery, [challengeIdx]);
      return challengeDetail;
    } catch (e) {
      throw new Error(500);
    }
  },

  createComment: async (userIdx, challengeIdx, comment) => {
    const insertCommentQuery =
      "INSERT INTO comment (userIdx,challengeIdx,comment) VALUES (?, ? ,?)";
    try {
      await db.query(insertCommentQuery, [userIdx, challengeIdx, comment]);
    } catch (e) {
      console.log(e);
      throw new Error(500);
    }
  },

  getCommentByChallengeIdx: async challengeIdx => {
    const selectCommentQuery = "SELECT * FROM comment WHERE challengeIdx=?";
    try {
      const [comments] = await db.query(selectCommentQuery, [challengeIdx]);
      return comments;
    } catch (e) {
      console.log(e);
      throw new Error(500);
    }
  }
};
module.exports = challengeModel;
