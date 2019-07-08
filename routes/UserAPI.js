"use strict";

const userController = require("../controllers/UserController");
const auth = require("../module/authUtils").isLoggedin;

module.exports = router => {
  router.route("/signin").post(userController.signIn);
  router.route("/signup").post(userController.signUp);
  router.route("/user/timeline").get(auth, userController.getTimeline);
  router.route("/user/:userIdx").get(auth, userController.getUserData);

  return router;
};
