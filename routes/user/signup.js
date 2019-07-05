var express = require('express');
var router = express.Router();
const path = require('path')
const modulePath  = path.join(__dirname,'../../module')
const connection = require(path.join(__dirname,'../../config/dbConfig.js'))
const encryption = require(path.join(modulePath,'./encryption.js'))
const responseMessage = require(path.join(modulePath,'./responseMessage.js'))
const utils = require(path.join(modulePath,'./utils.js'))
const statusCode = require(path.join(modulePath,'./statusCode.js'))
const searchIdQuery = "select * from user where id = ?"
const insertUserQuery =  'INSERT INTO user (id,name,password, salt) VALUES (?, ? ,? ,?)'


/***************선필 part*****************/



router.post('/',(req,res)=>{
console.log(req.body)
const id = req.body.id
const password  =req.body.password.toString()
const name = req.body.name
if(id == undefined || password == undefined || name == undefined)
    {
    //요청 바디값 오류
    res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
    return
    }
    connection.query(searchIdQuery,[id],async(err, result)=>{
        if(err)
        {
            //디비 내부 오류
            console.log(err)
            res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
          
        
            
        }
        else if(result.length>0)
        {
            //중복 아이디 오류
            console.log("중복 아이디 오류")
            console.log(result[0])
            res.send(utils.successFalse(statusCode.NO_CONTENT, responseMessage.ALREADY_USER))
    
        }
        else{
            console.log(password)
            let hashJson = await encryption.asyncCipher(password)
            console.log(hashJson)
            connection.query(insertUserQuery,[id,name,hashJson.cryptoPw,hashJson.salt],(err,result)=>{

                if(err)
                {
                    console.log(2)
                    console.log(err)
                    //디비 내부 오류
                    res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
                
                }
                else
                {
                    //저장 성공
                    res.send(utils.successTrue(statusCode.OK,responseMessage.SIGNUP_SUCCESS))
            
                }
            })
        }
    })

})



module.exports = router;