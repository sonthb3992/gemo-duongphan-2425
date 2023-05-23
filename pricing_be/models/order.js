const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      drink: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
      size: {
        type: String,
        required: false,
      },
      hasWhippingCream: {
        type: Boolean,
        required: false,
      },
      milkOption: {
        type: String,
        required: false,
      },
      chocolateSaucePumps: {
        type: Number,
        required: false,
      },
      food: {
        type: String,
        required: false,
      },
      selectedCustomizations: {
        type: [String],
        required: false,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    required: true,
  },
  cartPrice: {
    totalCartPrice: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    totalCartPriceAfterTax: {
      type: Number,
      required: true,
    },
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
