const Order = require("../models/orderModel");

async function placeOrder(req, res) {
    const { items } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: "User not authenticated" });
    }

    try {
        const userId = req.user.id;

        // Validate each item has required fields
        const validItems = items.map(item => ({
            productId: item.productId,
            name: item.name,
            qty: item.qty,
            price: item.price,
            images: item.images || item.image || "" // fallback if frontend sends `image` not `images`
        }));

        const order = new Order({
            userId,
            items: validItems
        });

        await order.save();
        return res.status(201).json({ msg: "Order placed", order });
    } catch (err) {
        console.error("Order save error:", err.message);
        return res.status(500).json({ msg: "Failed to place order", error: err.message });
    }
}

async function getUserOrders(req, res) {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate("items.productId", "name price image")
            .sort({ createdAt: -1 });

        return res.json(orders);
    } catch (err) {
        console.error("Get orders failed:", err.message);
        return res.status(500).json({ msg: "Failed to fetch orders", error: err.message });
    }
}

module.exports = { placeOrder, getUserOrders };
