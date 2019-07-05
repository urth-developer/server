var express = require('express');
var router = express.Router();
const path = require('path')
const modulePath  = path.join(__dirname,'../../module')
const connection = require(path.join(__dirname,'../../config/dbConfig.js'))
const encryption = require(path.join(modulePath,'./encryption.js'))
const responseMessage = require(path.join(modulePath,'./responseMessage.js'))
const utils = require(path.join(modulePath,'./utils.js'))
const statusCode = require(path.join(modulePath,'./statusCode.js'))
var jwt = require(path.join(modulePath,'./jwt.js'))
const searchIdQuery = "select * from user where id = ?"



/***************선필 part*****************/

router.post('/',(req,res)=>{
    const id = req.body.id
    const password  =req.body.password
    if(id == undefined || password == undefined)
    {
    //요청 바디값 오류
    res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
    return
    }
    connection.query(searchIdQuery,[id],async(err, result)=>{
        if(err)
        {
          res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
      
        }
        else if(result.length < 1)
        {
          res.json(utils.successFalse(statusCode.NO_CONTENT, responseMessage.ID_OR_PW_WRONG_VALUE))
        }
        else
        {
          await encryption.asyncVerifyConsistency(password,result[0].salt,result[0].password).then(()=>{
      
            let token =jwt.sign(result[0].idx)
            delete token.refreshToken

              let data ={
                "token" : token.token 
              }
              res.json(utils.successTrue(statusCode.OK,responseMessage.LOGIN_SUCCESS,data))
          }).catch(()=>{
              res.json(utils.successFalse(statusCode.NO_CONTENT,responseMessage.ID_OR_PW_WRONG_VALUE))
          })
        }
      
      
      
      
      })


    
})

module.exports = router;