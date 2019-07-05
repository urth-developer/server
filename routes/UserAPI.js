'use strict';

const userController = require('../controllers/UserController');


module.exports = (router) => {

  router.route('/sign/in')
    .post(userController.signIn);

  router.route('/sign/up')
    .post();

  router.route('/users')
    .get()
    .post();


  return router
};