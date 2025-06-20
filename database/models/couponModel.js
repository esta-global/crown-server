const mongoose = require("mongoose");
const {
  COUPON_USERS,
  DISCOUNT_TYPE,
  COUPON_STATUS,
} = require("../../constants/coupon");

const modelSchema = new mongoose.Schema(
  {
    couponCode: { type: String, trim: true, required: true, unique: true },
    applyFor: { type: String, enum: COUPON_USERS },
    discountType: { type: String, enum: DISCOUNT_TYPE },
    discount: { type: Number },
    description: { type: String, trim: true },
    minimumAmount: { type: Number },
    numberOfUsesTimes: { type: Number },
    startDate: { type: Date },
    expiryDate: { type: Date },
    // image: { type: String, default: null },
    couponStatus: { type: String, enum: COUPON_STATUS },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("coupon", modelSchema);
