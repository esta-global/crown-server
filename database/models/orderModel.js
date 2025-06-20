const mongoose = require("mongoose");
const { ORDER_STATUS } = require("../../constants/orderStatus");
const modelSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    mobile: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },

    // Shipping Address
    address: { type: String, trim: true, default: "" },
    locality: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },

    products: [
      {
        product: { ref: "product", type: mongoose.Schema.Types.ObjectId },
        name: String,
        a4Image: String,
        salePrice: Number,
        mrp: Number,
        qty: Number,

        category: { ref: "category", type: mongoose.Schema.Types.ObjectId },

        subCategory: {
          ref: "subCategory",
          type: mongoose.Schema.Types.ObjectId,
        },

        decorSeries: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "decorSeries",
        },
        decorNumber: { type: String, trim: true },
        ralNumber: { type: String, trim: true },
      },
    ],

    subtotalAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },

    orderStatus: { type: String, enum: ORDER_STATUS, default: "ORDER_PLACED" },

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

module.exports = mongoose.model("order", modelSchema);
