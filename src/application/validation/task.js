const Joi = require("@hapi/joi");

exports.validateTask = (data) => {
 const schema = Joi.object({
   name: Joi.string(),
   description: Joi.string(),
 });

 return schema.validate(data);
}


