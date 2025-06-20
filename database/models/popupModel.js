const mongoose = require("mongoose");
const { POPUP_TYPES } = require("../../constants/popup");

const modelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    descriptions: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    popupType: {
      type: String,
      enum: POPUP_TYPES,
      default: POPUP_TYPES[0],
    },

    status: { type: Boolean, default: true },
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

module.exports = mongoose.model("popup", modelSchema);
