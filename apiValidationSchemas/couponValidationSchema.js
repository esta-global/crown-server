const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const {
  COUPON_USERS,
  DISCOUNT_TYPE,
  COUPON_STATUS,
} = require("../constants/coupon");

// create
module.exports.create = Joi.object({
  couponCode: Joi.string().required().label("Coupon Code"),
  applyFor: Joi.string()
    .valid(...COUPON_USERS)
    .required()
    .label("Coupon User"),
  discountType: Joi.string()
    .valid(...DISCOUNT_TYPE)
    .required()
    .label("Discount Type"),
  discount: Joi.number().required().label("Discount"),
  description: Joi.string().allow("").label("Description"),
  minimumAmount: Joi.number().required().label("Min Amount"),
  numberOfUsesTimes: Joi.number().required().label("No of Uses"),
  startDate: Joi.string().required().label("Start Date"),
  expiryDate: Joi.string().required().label("Expiry Date"),
  //   image: Joi.string().allow("").label("Image"),
  couponStatus: Joi.string()
    .valid(...COUPON_STATUS)
    .required()
    .label("Coupon Status"),
});

// findAll
module.exports.findAll = Joi.object({
  couponCode: Joi.string(),
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  couponStatus: Joi.string().valid(...COUPON_STATUS, "ALL", ""),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  couponCode: Joi.string().required().label("Coupon Code"),
  applyFor: Joi.string()
    .valid(...COUPON_USERS)
    .required()
    .label("Coupon User"),
  discountType: Joi.string()
    .valid(...DISCOUNT_TYPE)
    .required()
    .label("Discount Type"),
  discount: Joi.number().required().label("Discount"),
  description: Joi.string().allow("").label("Description"),
  minimumAmount: Joi.number().required().label("Min Amount"),
  numberOfUsesTimes: Joi.number().required().label("No of Uses"),
  startDate: Joi.string().required().label("Start Date"),
  expiryDate: Joi.string().required().label("Expiry Date"),
  //   image: Joi.string().allow("").label("Image"),
  couponStatus: Joi.string()
    .valid(...COUPON_STATUS)
    .required()
    .label("Coupon Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
