const Product = require("../models/productModel");

exports.addProduct = async (req, res) => {
  try {
    const { name, description, image, price, category, page } = req.body;

    const product = new Product({
      name,
      description,
      image,
      price,
      category,
      page
    });

    await product.save();
    res.status(201).json({ message: `✅ Product added to ${page} section successfully!`, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page } = req.query; // e.g. ?page=more-collections
    const filter = page ? { page } : {};
    const products = await Product.find(filter);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addProduct = async (req, res) => {
  try {
    const { name, description, image, price, category } = req.body;
    const newProduct = await Product.create({ name, description, image, price, category });
    res.json({ success: true, message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};