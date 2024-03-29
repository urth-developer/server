const responseMessage = require("../module/responseMessage");
const challengeModel = require("../models/challengeModel");
const statusCode = require("../module/statusCode");
const utils = require("../module/utils");
const authModel = require("../models/authModel");
const request = require("request");
const FormData = require("form-data");
const toStream = require("buffer-to-stream");
const fs = require("fs");
const validate = require("../module/validate");
var aws = require("aws-sdk");
const s3Url = "https://sopt24.s3.ap-northeast-2.amazonaws.com/";
const moment = require('moment');
aws.config.loadFromPath(__dirname + "/../config/awsconfig.json");
const s3 = new aws.S3();
const AuthController = {
  authChallenge: async (req, res, next) => {
    /**
     * Expree validator 필요
     *
     */
    // const { error } = validate.authChallenge(req.body);
    // if (error)
    //  return res.status(200).json(util.successFalse(statusCode.BAD_REQUEST, error.details[0].message));

    const { challengeIdx } = req.body;
    const userIdx = req.decoded.idx;

    console.log(req.file);
    //1.해당 챌린지 machine Learninng 필요 유무 판별
    const result = await authModel.selectMachineCategoryByChallengeIdx(challengeIdx);
    const dateString = moment().format("YYYY-MM-DD HH:mm:ss").toString()
    let paramS3 = {
      Bucket: "sopt24",
      Key:  dateString+req.file.originalname,
      Body: new Buffer(req.file.buffer, "binary")
    };
    console.log("idx",result[0].machineLearningCategoryIdx)
    if (result[0].machineLearningCategoryIdx != 1) {
      //2.필요 할경우, 판별해서 아니면 인증 실패
      try {
        request.post(
          {
            headers: {
              "content-type": "multipart/form-data"
            },
            url: "http://35.192.113.207:5000/predict",
            form: {
              image: req.file.buffer.toString("base64")
            }
          },
          function optionalCallback(err, httpResponse, body) {
            if (err) {
              console.error("upload failed:", err);
              throw new Error(500);
            }
            const MLbody = JSON.parse(body);
            console.log(MLbody);
            console.log(MLbody.item);
            console.log(typeof MLbody.item);

            if (result[0].name === MLbody.item && MLbody.prob > 0.5) {
              //인증 결과값 확인 해서 저장하고 response
              s3.putObject(paramS3, async function(err, data) {
                if (err) {
                  return next(err);
                } else {
                  const url = s3Url + dateString+req.file.originalname;
                  console.log(url);

                  try {
                    await authModel.insertAuthChallenge(userIdx, challengeIdx, url);
                    return res.json(
                      utils.successTrue(statusCode.OK, responseMessage.AUTH_CHALLENGE_IMG_SUCCESS)
                    );
                  } catch (e) {
                    console.log(e);
                    return next(e);
                  }
                }
              });
              //return  res.json(utils.successTrue(statusCode.OK,responseMessage.AUTH_CHALLENGE_IMG_SUCCESS))
            } else {
              //인증 결과 불일치
              return res.json(
                utils.successFalse(statusCode.OK, responseMessage.AUTH_CHALLENGE_IMG_FAIL)
              );
            }
          }
        );
      } catch (e) {
        console.log(e);
        return next(e);
      }
    } else {
      //3.필요 하지 않은 경우 s3 저장 하기
      s3.putObject(paramS3, async function(err, data) {
        if (err) {
          return next(err);
        } else {
          const url = s3Url + dateString+req.file.originalname;

          console.log(url);
          try {
            await authModel.insertAuthChallenge(userIdx, challengeIdx, url);
            return res.json(
              utils.successTrue(statusCode.OK, responseMessage.AUTH_CHALLENGE_IMG_SUCCESS)
            );
          } catch (e) {
            console.log(e);
            return next(e);
          }
        }
      });
    }
  },

  searchReportImageList: async (req, res, next) => {
    try {
      const challengeIdx = req.params.challengeIdx;
      const userIdx = req.decoded.idx;
      const result = await authModel.searchReportImageList(challengeIdx, userIdx);
      res.json(
        utils.successTrue(statusCode.OK, responseMessage.SEARCH_REPORT_IMG_SUCCESS, result[0])
      );
    } catch (error) {
      return next(error);
    }
  },

  reportChallengeImage: async (req, res, next) => {
    try {
      /*****
       * express-validation 필요 ,Parameter에 대한 오류 처리
       */

     // const { error } = validate.reportChallenge(req.body);
    //  if (error)
     //   return res.status(200).json(successFalse(statusCode.BAD_REQUEST, error.details[0].message));

      console.log(req.body);
      const { authChallengeIdx } = req.body;
      console.log(authChallengeIdx);

      await authModel.updateReportImage(authChallengeIdx);
      res.json(utils.successTrue(statusCode.OK, responseMessage.REPORT_WRONG_IMG_SUCCESS));
    } catch (error) {
      return next(error);
    }
  },
  searchAuthResult: async (req, res, next) => {
    try {
      const challengeIdx = req.params.challengeIdx;
      const userIdx = req.decoded.idx;
      console.log(userIdx);
      /****** */

      const challengeDetail = await challengeModel.findChallengeDetailByChallengeIdx(challengeIdx);

      const totalSuccessCount = challengeDetail.length;
      const participantArray = challengeDetail.map(elem => elem.participant);
      const userSuccessCount = challengeDetail.filter(elem => elem.participant === userIdx).length;
      const participantCount = [...new Set(participantArray)].length;

      const returnData = {
        ...challengeDetail[0],
        participant: undefined,
        name: undefined,
        creator: undefined,
        explanation: undefined,
        image: undefined,
        userSuccessCount
      };

      // categoryIdx
      // 그 해당 챌린지 총 카운트
      // 그 해당 챌린지 유저 카운트

      res.json(
        utils.successTrue(statusCode.OK, responseMessage.AUTH_CHALLENGE_RESULT_SUCCESS, returnData)
      );
    } catch (error) {
      return next(error);
    }
  }
};
module.exports = AuthController;
