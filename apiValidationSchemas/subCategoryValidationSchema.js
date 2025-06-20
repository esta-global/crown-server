const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  name: Joi.string().required().label("Name"),
  slug: Joi.string().required().label("Slug"),

  isApplication: Joi.boolean().label("Application"),
  isAddedToNavigation: Joi.boolean().label("Added To Navigation"),

  categories: Joi.array()
    .items(Joi.string().required())
    .required()
    .label("Categories"),
  image: Joi.string().allow("").label("Image"),
  shortDescription: Joi.string().allow("").label("Short Description"),

  priority: Joi.number().label("Priority"),

  listingTitle: Joi.string().allow("").label("Listing Title"),
  listingImage: Joi.string().allow("").label("Listing Image"),
  listingDescription: Joi.string().allow("").label("Listing Descriptions"),

  metaTitle: Joi.string().allow("").label("Meta Title"),
  metaDescription: Joi.string().allow("").label("Meta Descriptions"),
  metaKeywords: Joi.string().allow("").label("Meta Keywords"),
  status: Joi.boolean().label("Status"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),

  isApplication: Joi.boolean().label("Application"),
  isAddedToNavigation: Joi.boolean().label("Added To Navigation"),

  priority: Joi.string().valid("ASC", "DESC"),
  slug: Joi.string().allow(""),

  searchQuery: Joi.string(),
  category: Joi.string(),
  categories: Joi.array(),

  status: Joi.string(),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  name: Joi.string().required().label("Name"),
  slug: Joi.string().required().label("Slug"),

  isApplication: Joi.boolean().label("Application"),
  isAddedToNavigation: Joi.boolean().label("Added To Navigation"),

  categories: Joi.array().items(Joi.string()).required().label("Categories"),
  image: Joi.string().allow("").label("Image"),
  shortDescription: Joi.string().allow("").label("Short Description"),

  priority: Joi.number().label("Priority"),

  listingTitle: Joi.string().allow("").label("Listing Title"),
  listingImage: Joi.string().allow("").label("Listing Image"),
  listingDescription: Joi.string().allow("").label("Listing Descriptions"),

  metaTitle: Joi.string().allow("").label("Meta Title"),
  metaDescription: Joi.string().allow("").label("Meta Descriptions"),
  metaKeywords: Joi.string().allow("").label("Meta Keywords"),
  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
