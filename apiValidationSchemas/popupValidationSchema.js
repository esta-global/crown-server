const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const { POPUP_TYPES } = require("../constants/popup");

// create
module.exports.create = Joi.object({
  title: Joi.string().allow("").label("Title"),
  descriptions: Joi.string().allow("").label("Descriptions"),
  image: Joi.string().allow("").label("Image"),

  popupType: Joi.string()
    .required()
    .valid(...POPUP_TYPES)
    .label("Popup Type"),

  status: Joi.boolean().label("Status"),
});

// update
module.exports.update = Joi.object({
  title: Joi.string().allow("").label("Title"),
  descriptions: Joi.string().allow("").label("Descriptions"),
  image: Joi.string().allow("").label("Image"),

  popupType: Joi.string()
    .required()
    .valid(...POPUP_TYPES)
    .label("Popup Type"),

  status: Joi.boolean().label("Status"),
});

// findAll
module.exports.findAll = Joi.object({
  email: Joi.string().email(),
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  statys: Joi.string().valid(...POPUP_TYPES, "ALL", ""),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});

// -------------- ADMIN SECTION END --------------
