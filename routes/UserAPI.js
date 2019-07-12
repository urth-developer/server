"use strict";
const upload = require("../config/multer");
const userController = require("../controllers/UserController");
const auth = require("../module/authUtils").isLoggedin;

module.exports = router => {
  router.route("/signin").post(userController.signIn);
  router.route("/signup").post(userController.signUp);
  router.route("/user/profile").post(upload.single("profileImg"), auth, userController.profile);
  router.route("/user/timeline").get(auth, userController.getTimeline);
  router.route("/user/mydata").get(auth, userController.getUserData);
  router.route("/user/friends/search").post(auth, userController.searchFriend);
  router.route("/user/friends").post(auth, userController.addFriend);
  router.route("/user/friends/list").get(auth, userController.getFriendList);
  router.route("/user/friends/timeline/:userIdx").get(auth, userController.getFriendTimeline);
  router.route("/user/friends/:userIdx").get(auth, userController.getFriendData);
  return router;
};
