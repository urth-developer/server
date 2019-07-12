const Joi = require("@hapi/joi");

module.exports = {
  signup: data => {
    const schema = {
      id: Joi.string()
        .max(45)
        .required()
        .email(),
      nickname: Joi.string()
        .max(45)
        .required(),
      password: Joi.string()
        .max(200)
        .required()
    };
    return Joi.validate(data, schema);
  },
  profile: data => {
    const schema = {
      id: Joi.string()
        .max(45)
        .required()
        .email(),
      nickname: Joi.string()
        .max(45)
        .required(),
      profileImg: Joi.string().max(200)
    };
    return Joi.validate(data, schema);
  },
  signin: data => {
    const schema = {
      id: Joi.string()
        .max(45)
        .required()
        .email(),
      password: Joi.string()
        .max(200)
        .required()
    };
    return Joi.validate(data, schema);
  },
  suggestForUrth: data => {
    const schema = {
      contents: Joi.string()
        .max(300)
        .required()
    };
    return Joi.validate(data, schema);
  },
  createChallenge: data => {
    const schema = {
      name: Joi.string()
        .max(45)
        .required(),
      explanation: Joi.string()
        .max(2000)
        .required(),
      image: Joi.string()
        .max(200)
        .required(),
      category: Joi.string().valid("1", "2", "3", "4", "5")
    };
    return Joi.validate(data, schema);
  },
  authChallenge: data => {
    const schema = {
      challengeIdx: Joi.number()
        .integer()
        .required(),
      image: Joi.string()
        .max(200)
        .required()
    };
    return Joi.validate(data, schema);
  },
  reportChallenge: data => {
    const schema = {
      authChallengeIdx: Joi.number()
        .integer()
        .required()
    };
    return Joi.validate(data, schema);
  }
};
