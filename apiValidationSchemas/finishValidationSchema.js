const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  shortName: Joi.string().required().label("Short Name"),
  fullName: Joi.string().required().label("Full Name"),
  priority: Joi.number().label("Priority"),
  status: Joi.boolean().required().label("Status"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  priority: Joi.string().valid("ASC", "DESC"),
  status: Joi.string().valid("All", "", "true", "false"),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  shortName: Joi.string().label("Short Name"),
  fullName: Joi.string().label("Full Name"),
  priority: Joi.number().label("Priority"),
  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
