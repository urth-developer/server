'use strict';


const pool = require('../config/dbConfig').pool;


const SEARCH_ID_QUERY = 'SELECT * FROM user WHERE id = ?';


const UserModel = {

  signIn: async (userData) => {
    try {

      const conn = pool.getConnection(async conn => conn);

      const [rows] = await conn.query(SEARCH_ID_QUERY, [userData.id, userData.password]);

      console.log(rows);

    } catch (e) {
      throw e;
    }
  },

  signUp: async (userData) => {
    try {

      const conn = pool.getConnection(async conn => conn);



    } catch (e) {
      throw e;
    }
  }
};


module.exports = UserModel;