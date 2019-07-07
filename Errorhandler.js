const responseMessage = require("./module/responseMessage");
const statusCode = require("./module/statusCode");
const util = require("./module/utils");
module.exports = app => {
  app.use((err, req, res, next) => {
    if (err.status == 600) {
      res.json(util.successFalse(statusCode.DB_ERROR, responseMessage.DB_ERR));
    } else if (err.status == 500) {
      res.json(
        util.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
      );
    } else if (err.status == 400) {
      res.json(util.successFalse(statusCode.BAD_REQUEST, err.message));
    } else {
      console.log(err);
      res.json(
        util.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
      );
    }
    //return res.status(response.status).json(response);
  });
};
