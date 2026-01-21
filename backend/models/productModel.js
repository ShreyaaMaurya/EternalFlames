const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: String,
  page: { type: String, default: "products" }, // 👈 to know which page it belongs to
});

module.exports = mongoose.model("Product", productSchema);
