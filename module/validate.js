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
        .required(),
      image: Joi.string().max(200)
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
  }
};
