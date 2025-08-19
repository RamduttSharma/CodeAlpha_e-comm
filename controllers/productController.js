const Product = require('../models/Product');

// 👉 Seed products automatically on server startup
async function seedProducts() {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            const productsData = [
                { name: "Wireless Earbuds", price: 1499, description: "Bluetooth 5.0 earbuds with noise cancellation.", images: "images/product1.jpeg" },
                { name: "Smart Fitness Band", price: 999, description: "Fitness tracker with heart rate monitor and step counter.", images: "images/product2.jpeg" },
                { name: "Portable Bluetooth Speaker", price: 1299, description: "Compact speaker with deep bass and 10-hour battery life.", images: "images/product3.jpeg" },
                { name: "USB-C Charger Adapter", price: 499, description: "Fast charging 20W USB-C wall adapter.", images: "images/product4.jpeg" },
                { name: "Gaming Mouse RGB", price: 899, description: "Ergonomic wired mouse with RGB lighting and 6 buttons.", images: "images/product5.jpeg" },
                { name: "Laptop Stand Adjustable", price: 799, description: "Foldable laptop stand for better posture and cooling.", images: "images/product7.jpeg" },
                { name: "LED Ring Light", price: 699, description: "Dimmable selfie ring light with tripod and phone holder.", images: "images/product8.jpeg" },
                { name: "Phone Holder for Desk", price: 349, description: "Adjustable stand compatible with all smartphones.", images: "images/product9.jpeg" },
                { name: "Screen Cleaning Kit", price: 299, description: "Spray and microfiber cloth for cleaning screens.", images: "images/product10.jpeg" },
                { name: "Fast Charging Cable", price: 199, description: "1.5m USB-A to Type-C fast charging cable.", images: "images/product11.jpeg" },
                { name: "Wireless Charger Pad", price: 899, description: "10W fast wireless charger for Qi-enabled devices.", images: "images/product12.jpeg" },
                { name: "Backpack for Laptop", price: 1199, description: "Water-resistant backpack with USB charging port.", images: "images/product13.jpeg" },
                { name: "Noise Cancelling Headphones", price: 2499, description: "Over-ear headphones with active noise cancellation.", images: "images/product14.jpeg" },
                { name: "Slim Power Bank 10000mAh", price: 999, description: "Fast-charging, pocket-size power bank with dual USB ports.", images: "images/product15.jpeg" },
                { name: "Smartphone Tripod Stand", price: 649, description: "Adjustable tripod stand compatible with all smartphones.", images: "images/product16.jpeg" },
                { name: "Table Lamp with USB Port", price: 799, description: "LED table lamp with brightness control and charging port.", images: "images/product17.jpeg" },
                { name: "Men's Formal Belt", price: 599, description: "Leather reversible belt with metal buckle.", images: "images/product18.jpeg" },
                { name: "Desk Organizer", price: 399, description: "Multi-compartment organizer for pens, phone, and notepads.", images: "images/product19.jpeg" },
                { name: "Wireless Keyboard and Mouse Combo", price: 1799, description: "Sleek combo set with silent keys and ergonomic design.", images: "images/product20.jpeg" }
            ];

            await Product.insertMany(productsData);
            console.log("✅ Products seeded successfully");
        } else {
            console.log("⚡ Products already exist, skipping seeding");
        }
    } catch (err) {
        console.error("❌ Failed to seed products:", err.message);
    }
}

// 👉 API endpoint version (trigger seeding manually)
exports.seedProducts = async (req, res) => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            return res.status(400).json({ msg: "Products already exist in the database" });
        }

        await seedProducts();
        res.status(201).json({ msg: "Products inserted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Failed to insert products", error: err.message });
    }
};

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

// 👉 Export startup seeding function for server.js
exports.seedProductsOnStartup = seedProducts;
