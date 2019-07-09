"use strict";

const pool = require("../config/dbConfig");

const userModel = {
  findByUserIdx: async userIdx => {
    try {
      const selectUserQuery = "SELECT * FROM user WHERE userIdx=?";
      const [user] = await pool.query(selectUserQuery, [userIdx]);
      return user[0];
    } catch (err) {
      console.log(err);
      throw new Error(500);
    }
  },

  getUserCount: async () => {
    try {
      const userCountQuery = "SELECT COUNT(*) AS count FROM user";
      const [count] = await pool.query(userCountQuery);
      return count[0].count;
    } catch (err) {
      console.log(err);
      throw new Error(500);
    }
  },

  findById: async id => {
    try {
      const selectIdQuery = `SELECT * FROM user WHERE id=?`;
      const [user] = await pool.query(selectIdQuery, [id]);
      return user[0];
    } catch (err) {
      console.log(err);
      throw new Error(500);
    }
  },

  findByNickname: async nickname => {
    try {
      const selectNicknameQuery = `SELECT * FROM user WHERE nickname=?`;
      const [user] = await pool.query(selectNicknameQuery, [nickname]);
      return user[0];
    } catch (err) {
      console.log(err);
      throw new Error(500);
    }
  },

  create: async (id, nickname, cryptoPw, salt, profileImg) => {
    try {
      const insertUserQuery =
        "INSERT INTO user (id,nickname,password, salt, profileImg) VALUES (?, ? ,? ,?, ?)";
      await pool.query(insertUserQuery, [id, nickname, cryptoPw, salt, profileImg]);
    } catch (err) {
      console.log(err);
      throw new Error(500);
    }
  },

  getUserAuthCountsByCategoryByUserIdx: async userIdx => {
    try {
      const getUserAuthCountsByCategoryByUserIdxQuery =
        "SELECT category, COUNT(*) AS categoryCount FROM authChallenge INNER JOIN challenge ON authChallenge.challengeIdx=challenge.challengeIdx WHERE userIdx=? GROUP BY category";
      let [result] = await pool.query(getUserAuthCountsByCategoryByUserIdxQuery, [userIdx]);
      const userAuthCountsByCategory = {};

      const categories = result.map(elem => parseInt(elem.category));
      for (let i = 1; i <= 5; i++) {
        if (categories.indexOf(i) === -1) userAuthCountsByCategory["category" + i] = 0;
      }

      result.forEach(
        elem => (userAuthCountsByCategory["category" + elem.category] = elem.categoryCount)
      );

      return userAuthCountsByCategory;
    } catch (err) {
      console.log(err);
      throw new Error(500);
    }
  },

  findAuthChallengeByUserIdx: async userIdx => {
    try {
      const selectAuthChallengeQuery = `SELECT * FROM authChallenge WHERE userIdx=? ORDER BY time DESC`;
      const [timeline] = await pool.query(selectAuthChallengeQuery, [userIdx]);
      return timeline;
    } catch (err) {
      console.log(err);
      throw new Error(500);
    }
  },

  checkFriendship: async (userIdx, friendIdx) => {
    try {
      const checkFriendQuery =
      // FIXME SELECT * -> SELECT id, ...
        "SELECT * FROM friendship WHERE (user1Idx=? AND user2Idx=?) OR (user2Idx=? AND user1Idx=?)";
      const [friendship] = await pool.query(checkFriendQuery, [
        userIdx,
        friendIdx,
        userIdx,
        friendIdx
      ]);
      return friendship[0];
    } catch (err) {
      console.log(err);
      throw new Error(500);
    }
  },

  addFriendByUserIdx: async (userIdx, friendIdx) => {
    try {
      const insertFriendQuery = "INSERT INTO friendship (user1Idx, user2Idx) VALUES (?, ?)";
      await pool.query(insertFriendQuery, [userIdx, friendIdx]);
    } catch (err) {
      console.log(err);
      throw new Error(500);
    }
  },

  findAllFriendsByUserIdx: async userIdx => {
    try {
      const checkFriendOfUser1IdxQuery =
        "SELECT COUNT(*) AS userSuccessCount, userIdx, nickname, level, profileImg FROM friendship INNER JOIN user ON friendship.user2Idx=user.userIdx NATURAL JOIN authChallenge WHERE friendship.user1Idx=? GROUP BY userIdx";
      const [result1] = await pool.query(checkFriendOfUser1IdxQuery, [userIdx]);

      const checkFriendOfUser2IdxQuery =
        "SELECT userIdx, nickname, level, profileImg, COUNT(*) AS userSuccessCount FROM friendship INNER JOIN user ON friendship.user1Idx=user.userIdx NATURAL JOIN authChallenge WHERE friendship.user2Idx=? GROUP BY userIdx";
      const [result2] = await pool.query(checkFriendOfUser2IdxQuery, [userIdx]);

      return result1.concat(result2);
      // const friendList = [];
      // result.forEach(elem => friendList.push(elem.user1Idx, elem.user2Idx));
      // return friendList.filter(idx => idx !== userIdx);
    } catch (err) {
      console.log(err);
      throw new Error(500);
    }
  }
};

module.exports = userModel;
