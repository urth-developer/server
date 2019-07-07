"use strict";

const pool = require("../config/dbConfig");

const userModel = {
  findByUserIdx: async userIdx => {
    const selectUserQuery = "SELECT * FROM user WHERE userIdx=?";
    const [user] = await pool.query(selectUserQuery, [userIdx]);
    return user[0];
  },

  findById: async id => {
    const selectIdQuery = `SELECT * FROM user WHERE id=?`;
    const [user] = await pool.query(selectIdQuery, [id]);
    return user[0];
  },

  findByNickname: async nickname => {
    const selectNicknameQuery = `SELECT * FROM user WHERE nickname=?`;
    const [user] = await pool.query(selectNicknameQuery, [nickname]);
    return user[0];
  },

  create: async (id, nickname, cryptoPw, salt, profileImg) => {
    const insertUserQuery =
      "INSERT INTO user (id,nickname,password, salt, profileImg) VALUES (?, ? ,? ,?, ?)";
    await pool.query(insertUserQuery, [id, nickname, cryptoPw, salt, profileImg]);
  },

  getUserAuthCountsByCategoryByUserIdx: async userIdx => {
    const getUserAuthCountsByCategoryByUserIdxQuery =
      "SELECT category, COUNT(*) AS categoryCount FROM authChallenge natural join challenge where userIdx=? GROUP BY category";
    let [userAuthCountsByCategory] = await pool.query(getUserAuthCountsByCategoryByUserIdxQuery, [
      userIdx
    ]);
    userAuthCountsByCategory = userAuthCountsByCategory.map(elem => elem.categoryCount);
    return userAuthCountsByCategory;
  }
};

module.exports = userModel;
