const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Utility function to get userId from req.user
function extractUserId(req) {
    return typeof req.user === 'object' ? req.user.id || req.user._id : req.user;
}

// ✅ GET USER PROFILE
exports.getProfile = async (req, res) => {
    try {
        const userId = extractUserId(req);

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch profile", error: err.message });
    }
};

// ✅ UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const userId = extractUserId(req);

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Incorrect current password" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.json({ msg: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Password update failed", error: err.message });
    }
};
