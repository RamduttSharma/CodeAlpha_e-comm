const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { seedProductsOnStartup } = require('./controllers/productController'); // ✅ correct import
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/profile', require('./routes/userRoutes'));

// Root route
app.get('/', (req, res) => {
    res.send("E-comm API is running...");
});

// Start server only after DB connects
connectDB().then(async () => {
    console.log("✅ MongoDB connected");

    // 👉 Seed products automatically once
    await seedProductsOnStartup();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});
