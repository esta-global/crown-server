const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
    },

    isApplication: {
      type: Boolean,
      default: false,
    },
    isAddedToNavigation: {
      type: Boolean,
      default: false,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    image: {
      type: String,
      trim: true,
    },

    priority: { type: Number, default: 0 },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    listingTitle: { type: String, default: "", trim: true },
    listingImage: { type: String, trim: true, default: "" },
    listingDescription: { type: String, default: "", trim: true },

    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },
    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },
    metaKeywords: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
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

module.exports = mongoose.model("subCategory", modelSchema);
