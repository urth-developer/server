'use strict';

const path = require('path');
const modulePath  = path.join(__dirname,'../../module');
const responseMessage = require('../module/responseMessage.js');
const utils = require('../module/utils.js');
const statusCode = require('../module/statusCode.js');
const jwt = require('../module/jwt.js');


const userModel = require('../models/UserModel');

const UserController = {

  signIn: async (req, res, next) => {
    try {

      const {id, password} = req.body;

      if (!id || !password) {
        return res.json(utils.successFalse(statusCode.NO_CONTENT, responseMessage.ID_OR_PW_WRO_VALUE));
      }

      const userData = {id, password};
      const result = await userModel.signIn(userData);

      return res.json(result);

    } catch (e) {
      throw e;
    }

  },

  signUp: async (req, res, next) => {
    try {
      const {id, password, name} = req.body;


      const data = {id, password, name};
      const result = await userModel.signUp(data);

    } catch (e) {
      throw e;
    }

  },



};



module.exports = UserController;