// var randtoken = require("rand-token");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/secretkey");
const options = {
  algorithm: "HS256",
  expiresIn: "24h* 365",
  issuer: "soptoon"
};
// const refreshOptions = {
//   algorithm: "HS256",
//   expiresIn: "24h * 14",
//   issuer: "soptoon"
// };

module.exports = {
  sign: idx => {
    const payload = {
      idx: idx
    };

    const result = {
      token: jwt.sign(payload, secretKey, options)
      //refreshToken: randtoken.uid(256)
    };
    //refreshToken을 만들 때에도 다른 키를 쓰는게 좋다.

    return result;
  },
  verify: token => {
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      if (err.message === "jwt expired") {
        console.log("expired token");
        return -3;
      } else if (err.message === "invalid token") {
        console.log("invalid token");
        return -2;
      } else {
        console.log("invalid token");
        return -2;
      }
    }
    return decoded;
  }
  //   refresh: user => {
  //     const payload = {
  //       idx: user.idx,
  //       grade: user.grade,
  //       name: user.name
  //     };

  //     return jwt.sign(payload, secretKey, options);
  //   }
};
