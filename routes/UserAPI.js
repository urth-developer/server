"use strict";

const userController = require("../controllers/UserController");

module.exports = router => {
  router.route("/signin").post(userController.signIn);

  router.route("/signup").post(userController.signUp);

  return router;
};
