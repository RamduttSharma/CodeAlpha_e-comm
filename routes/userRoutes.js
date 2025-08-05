const express = require('express');
const router = express.Router();
const { getProfile, updatePassword } = require('../controllers/userController');
const authMiddleware = require('../controllers/authMiddleware');

// GET /api/profile
router.get('/', authMiddleware, getProfile);

// PUT /api/profile/password
router.put('/password', authMiddleware, updatePassword);

module.exports = router;
