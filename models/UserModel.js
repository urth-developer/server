"use strict";

const pool = require("../config/dbConfig");

const SEARCH_ID_QUERY = "SELECT id FROM user WHERE id = ?";
const INSERT_USER_QUERY = "INSERT INTO user (id, name, password, salt) VALUES (?, ? ,? ,?)";

const userModel = {
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
  }
};

module.exports = userModel;
