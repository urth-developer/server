const Joi = require("@hapi/joi");

module.exports = {
  signup: user => {
    const schema = {
      id: Joi.string()
        .max(45)
        .required(),
      nickname: Joi.string()
        .max(45)
        .required(),
      password: Joi.string()
        .max(200)
        .required(),
      image: Joi.string().max(200)
    };
    return Joi.validate(user, schema);
  }
};
