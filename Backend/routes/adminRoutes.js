const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAdminStats,
    getAllUsers,
} = require("../controllers/adminController");

// Admin dashboard statistics
router.get(
    "/stats",
    authMiddleware,
    adminMiddleware,
    getAdminStats
);

// Get all registered users
router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

module.exports = router;