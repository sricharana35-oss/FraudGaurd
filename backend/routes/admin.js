const express = require("express");
const User = require("../models/user");

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find()
            .sort({ createdAt: -1 })
            .select("-__v");

        res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Admin users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
});

// Get dashboard statistics
router.get("/stats", async (req, res) => {
    try {
        const total = await User.countDocuments();

        const low = await User.countDocuments({
            riskLevel: "LOW"
        });

        const medium = await User.countDocuments({
            riskLevel: "MEDIUM"
        });

        const high = await User.countDocuments({
            riskLevel: "HIGH"
        });

        res.json({
            success: true,
            stats: {
                total,
                low,
                medium,
                high
            }
        });

    } catch (error) {
        console.error("Stats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics"
        });
    }
});

module.exports = router;
