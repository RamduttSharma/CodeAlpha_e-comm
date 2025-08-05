const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const bearer = req.header("Authorization");
    if (!bearer) return res.status(401).json({ msg: "No token provided" });

    const token = bearer.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // Always sets req.user.id
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ msg: "Invalid token" });
    }
};
