const mongoose = require("mongoose");   // ✅ ADD THIS

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,        // 🔥 REQUIRED for showing user-specific orders
    },
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    address: String,
    city: String,
    pincode: String,

    items: {
      type: Array,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
