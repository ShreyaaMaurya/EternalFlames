const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    page: String
}, { timestamps: true });

// Check if model already exists to avoid OverwriteModelError
module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);
