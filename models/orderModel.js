const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            qty: { type: Number, required: true },
            name: { type: String },
            price: { type: Number },
            images: { type: String },
            description: {type: String} // Even if frontend sends image, we save as `images` field
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
