const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    slug: { type: String, unique: true, required: true, trim: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],

    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
      },
    ],

    decorSeries: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "decorSeries",
    },

    sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: "size" }],
    sizeFinishes: [{ type: mongoose.Schema.Types.ObjectId, ref: "sizeFinish" }],

    salePrice: { type: Number, default: 0 },
    mrp: { type: Number, default: 0 },

    // finish: { type: String, trim: true },
    // decorName: { type: String, trim: true },
    decorNumber: { type: String, trim: true, unique: true },
    sku: { type: String, trim: true },

    a4Image: { type: String, trim: true },
    fullSheetImage: { type: String, trim: true },
    highResolutionImage: { type: String, trim: true },

    // defaultVideo: { type: String, trim: true },
    // images: [{ type: String, trim: true }],

    descriptions: { type: String, trim: true },
    shortDescription: { type: String, trim: true },

    ralNumber: { type: String, trim: true },

    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },
    metaKeywords: { type: String, default: "", trim: true },

    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("product", modelSchema);
