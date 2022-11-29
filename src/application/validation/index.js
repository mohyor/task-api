const Joi = require("@hapi/joi");

exports.validateCreateUser = (data) => {
  const schema = Joi.object({
    name: Joi.required(),
    username: Joi.required(),
    email: Joi.required(),
    password: Joi.required(),
  });

  return schema.validate(data);
};

exports.validateUpdateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string(),
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    picture: Joi.string(),
    address: Joi.object(),

  });

  return schema.validate(data);
};

exports.validateUserLogin = (data) => {
  const schema = Joi.object({
    username: Joi.required(),
    password: Joi.required(),
  });

  return schema.validate(data);
};