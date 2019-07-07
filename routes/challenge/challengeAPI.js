var express = require("express");
var router = express.Router();
const path = require("path");
const modulePath = path.join(__dirname, "../../module");
const modelPath = path.join(__dirname, "../../model");
const responseMessage = require(path.join(modulePath, "./responseMessage.js"));
const utils = require(path.join(modulePath, "./utils.js"));
const statusCode = require(path.join(modulePath, "./statusCode.js"));
const challengeController = path.join(modelPath, "/challengeController.js");
const authUtil = require(path.join(modulePath, "./authUtils"));
const upload = require("../../config/multer");
router.post(
  "/",
  authUtil.isLoggedin,
  upload.single("image"),
  async (req, res, next) => {
    const img = req.file.location;
    result = await challengeController.createChallenge(req.body, img, next);
  }
);

//router.route("/theme").post(challengeController.createChallenge);

router.get("/favorite", (req, res, next) => {});

router.get("/hot", (req, res, next) => {});

router.get("/top10", (req, res, next) => {});

module.exports = router;
