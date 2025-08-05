const Product = require('../models/Product');

// GET all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: "Failed to load products", error: err.message });
    }
};

// GET product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch product", error: err.message });
    }
};
