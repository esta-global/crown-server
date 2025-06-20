const mongoose = require("mongoose");
const {
  SUBSCRIPTION_STATUS,
  NEWSLETTER_SOURCE,
} = require("../../constants/newsletter");

const modelSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },

    subscriptionStatus: {
      type: String,
      enum: SUBSCRIPTION_STATUS,
      default: SUBSCRIPTION_STATUS[0],
    },

    source: {
      type: String,
      enum: NEWSLETTER_SOURCE,
      default: NEWSLETTER_SOURCE[0],
    },

    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
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

module.exports = mongoose.model("newsletter", modelSchema);
