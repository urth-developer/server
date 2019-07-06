'use strict';


const pool = require('../config/dbConfig').pool;


const SEARCH_ID_QUERY = 'SELECT id FROM user WHERE id = ?';
const INSERT_USER_QUERY = 'INSERT INTO user (id, name, password, salt) VALUES (?, ? ,? ,?)';


const UserModel = {

  signIn: async (userData) => {
    try {

      const [rows] = await pool.query(SEARCH_ID_QUERY, [userData.id, userData.password]);

      console.log(rows);

      return rows;
    } catch (e) {
      throw e;
    }
  },

  signUp: async (userData) => {
    try {


      const [rows] = await pool.query(INSERT_USER_QUERY, []);



    } catch (e) {
      throw e;
    }
  },

  checkId: async (userData) => {
    try {

      const [rows] = await pool.query(SEARCH_ID_QUERY, [userData.id]);

      console.log('rows', rows);
      return rows;

    } catch (e) {
      throw e;
    }
  },

};


module.exports = UserModel;