const db = require("../config/dbConfig");
const InsertChallengeQuery =
  "INSERT INTO suggestionChallenge (name,category,explanation,image,creator) VALUES (?,?,?,?,?)";

/***creator 7/12 수정 필요****/
/***수정 완료 7/12 */
const SelectTop10ChallengeQuery =
  "SELECT challengeIdx,image, name,count , user.nickname as creator  FROM challenge  left join user on challenge.creator = user.userIdx ORDER BY count DESC LIMIT 10";

const SelectBookMarkChallengeQuery =
  "SELECT image , challengeIdx, name FROM BookmarkChallenge  natural JOIN challenge WHERE userIdx = ? ORDER BY favoriteOrder ASC";

/**********/
const InsertTogetherChallengeQuery =
  "INSERT INTO ongoingChallenge (userIdx , challengeIdx) VALUES (?,?)";

/*** creator 7/12 수정 필요 ****/
/****수정 완료 7/12**** */
const SelectTogetherChallengeQuery =
  "SELECT ongoingChallenge.challengeIdx , challenge.name , challenge.image , count(authChallengeIdx) as count, user.nickname as creator  FROM ongoingChallenge natural join challenge left join authChallenge on ongoingChallenge.challengeIdx = authChallenge.challengeIdx  left join user on challenge.creator = user.id  where ongoingChallenge.userIdx = ? group by  ongoingChallenge.challengeIdx";
const DeleteTogetherChallengeQuery =
  "DELETE FROM ongoingChallenge WHERE userIdx = ? and challengeIdx =?";
const UPDATEBookMarkChallengeQuery =
  "UPDATE  BookmarkChallenge SET favoriteOrder = ? WHERE userIdx = ?  AND challengeIdx =?";

/*****creator 7/12 수정 필요*****/
/***수정 완료 7/12 */
const SelectTodayChallenge =
  "SELECT challengeIdx, name, image ,user.nickname as creator, count FROM todayChallenge natural join challenge left join user on creator = userIdx ORDER BY todayChallengeIdx DESC LIMIT 3";

const challengeModel = {
  insertChallenge: async (name, category, explanation, image, creator) => {
    try {
      await db.query(InsertChallengeQuery, [name, category, explanation, image, creator]);
    } catch (e) {
      console.log(e);
      throw new Error(600);
    }
  },
  SearchBookMarkChallengeList: async userIdx => {
    try {
      const result = await db.query(SelectBookMarkChallengeQuery, [userIdx]);
      return result[0];
    } catch (e) {
      throw new Error(600);
    }
  },
  SearchTop10ChallengeList: async () => {
    try {
      const result = await db.query(SelectTop10ChallengeQuery);
      console.log(result[0]);
      return result[0];
    } catch (e) {
      throw new Error(600);
    }
  },
  UpdateFavoriteChallengeOrder: async (userIdx, favoriteChallengeList) => {
    try {
      for (let i = 0; i < favoriteChallengeList.length; i++) {
        await db.query(UPDATEBookMarkChallengeQuery, [
          favoriteChallengeList[i].favoriteOrder,
          userIdx,
          favoriteChallengeList[i].challengeIdx
        ]);
      }
    } catch (e) {
      throw new Error(600);
    }
  },
  InsertTogetherChallenge: async (userIdx, challengeIdx) => {
    try {
      const result = await db.query(InsertTogetherChallengeQuery, [userIdx, challengeIdx]);
      return result;
    } catch (e) {
      throw new Error(600);
    }
  },
  DeleteTogetherChallenge: async (userIdx, challengeIdx) => {
    try {
      const result = await db.query(DeleteTogetherChallengeQuery, [userIdx, challengeIdx]);
      return result;
    } catch (e) {
      throw new Error(600);
    }
  },

  SearchTogetherChallengeList: async userIdx => {
    try {
      const result = await db.query(SelectTogetherChallengeQuery, [userIdx]);
      console.log(result[0]);
      return result[0];
    } catch (e) {
      throw new Error(600);
    }
  },

  findAllChallengesWithSameCategory: async categoryIdx => {
    const selectAllChallengesWithSameCategoryQuery =
      "SELECT challengeIdx, name, image, count, category, nickname AS creator FROM challenge INNER JOIN user ON challenge.creator=user.userIdx WHERE category=?";

    try {
      const [challenges] = await db.query(selectAllChallengesWithSameCategoryQuery, [categoryIdx]);
      return challenges;
    } catch (e) {
      throw new Error(600);
    }
  },
  groupChallengesByCategory: async () => {
    const getAuthCountsByCategoryQuery =
      "SELECT category, COUNT(*) AS categoryCount FROM authChallenge INNER JOIN challenge ON authChallenge.challengeIdx=challenge.challengeIdx GROUP BY category";

    try {
      let [result] = await db.query(getAuthCountsByCategoryQuery);
      const authCountsByCategory = {};

      const categories = result.map(elem => parseInt(elem.category));
      for (let i = 1; i <= 5; i++) {
        if (categories.indexOf(i) === -1) authCountsByCategory["category" + i] = 0;
      }

      result.forEach(
        elem => (authCountsByCategory["category" + elem.category] = elem.categoryCount)
      );

      return authCountsByCategory;
    } catch (e) {
      console.log(e);
      throw new Error(600);
    }
  },
  findKeywords: async () => {
    const selectAllKeywordsQuery = "SELECT * FROM searchKeywords";

    try {
      let [keywords] = await db.query(selectAllKeywordsQuery);
      return keywords;
    } catch (e) {
      throw new Error(600);
    }
  },

  searchByWord: async searchWord => {
    const selectAllKeywordsQuery =
      "SELECT challengeIdx, name, image, count, category, nickname AS creator FROM challenge INNER JOIN user ON challenge.creator=user.userIdx WHERE name LIKE ?";

    try {
      let [challenges] = await db.query(selectAllKeywordsQuery, ["%" + searchWord + "%"]);
      return challenges;
    } catch (e) {
      console.log(e);
      throw new Error(600);
    }
  },

  findChallengeDetailByChallengeIdx: async challengeIdx => {
    const selectChallengeQuery =
      "SELECT nickname AS creator, challenge.challengeIdx, authChallenge.userIdx AS participant, name, explanation, challenge.image, count, category FROM challenge INNER JOIN authChallenge ON challenge.challengeIdx=authChallenge.challengeIdx INNER JOIN user ON authChallenge.userIdx=user.userIdx WHERE challenge.challengeIdx=?";
    try {
      let [challengeDetail] = await db.query(selectChallengeQuery, [challengeIdx]);
      return challengeDetail;
    } catch (e) {
      throw new Error(600);
    }
  },
  findChallengeByChallengeIdx: async challengeIdx => {
    const selectChallengeQuery =
      "SELECT nickname AS creator, challengeIdx, name, explanation, image, count, category FROM challenge INNER JOIN user ON challenge.creator=user.userIdx WHERE challenge.challengeIdx=?";
    try {
      let [challengeDetail] = await db.query(selectChallengeQuery, [challengeIdx]);
      return challengeDetail;
    } catch (e) {
      throw new Error(600);
    }
  },

  createComment: async (userIdx, challengeIdx, comment) => {
    const insertCommentQuery =
      "INSERT INTO comment (userIdx,challengeIdx,comment) VALUES (?, ? ,?)";
    try {
      await db.query(insertCommentQuery, [userIdx, challengeIdx, comment]);
    } catch (e) {
      console.log(e);
      throw new Error(600);
    }
  },

  getCommentByChallengeIdx: async challengeIdx => {
    const selectCommentQuery = "SELECT * FROM comment WHERE challengeIdx=?";
    try {
      const [comments] = await db.query(selectCommentQuery, [challengeIdx]);
      return comments;
    } catch (e) {
      console.log(e);
      throw new Error(600);
    }
  },

  searchTodayChallengeList: async () => {
    try {
      const result = await db.query(SelectTodayChallenge);
      return result[0];
    } catch (e) {
      throw new Error(600);
    }
  }
};
module.exports = challengeModel;
