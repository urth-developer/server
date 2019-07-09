const db = require("../config/dbConfig");
const InsertChallengeQuery =
  "INSERT INTO suggestionChallenge (name,category,explanation,image) VALUES (?,?,?,?)";
const SelectTop10ChallengeQuery = "SELECT * FROM challenge ORDER BY count DESC LIMIT 10";
const SelectBookMarkChallengeQuery =
  "SELECT * FROM BookmarkChallenge  natural JOIN challenge WHERE userIdx = ? ORDER BY favoriteOrder DESC";

const challengeModel = {
  insertChallenge: async (name, categoryIdx, explanation, image, next) => {
    try {
      await db.query(InsertChallengeQuery, [name, categoryIdx, explanation, image]);
    } catch (e) {
      throw new Error(500);
    }
  },
  SearchBookMarkChallengeList: userIdx => {
    try {
      const user = req.decode;
      const result = db.query(SelectBookMarkChallengeQuery, [userIdx]);
      return result;
    } catch (e) {
      throw new Error(500);
    }
  },
  SearchTop10ChallengeList: async () => {
    try {
      const result = await db.query(SelectTop10ChallengeQuery);
      return result;
    } catch (e) {
      throw new Error(500);
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

  searchByWord: async searchWord => {
    const selectAllKeywordsQuery = "SELECT * FROM challenge WHERE name LIKE ?";

    try {
      let [challenges] = await db.query(selectAllKeywordsQuery, ["%" + searchWord + "%"]);
      return challenges;
    } catch (e) {
      console.log(e);
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
