const express = require("express");
const User = require("../models/User");
const calculateRisk = require("../services/fraudDetection");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { name, email, deviceId } = req.body;

        // Check required fields
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Clean email
        const cleanEmail = email.trim().toLowerCase();

        // Check whether email already exists
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        // Collect signup signals
        const ipAddress =
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket.remoteAddress;

        const userAgent = req.headers["user-agent"];

        // Calculate fraud risk BEFORE saving the new user
        const fraudResult = await calculateRisk({
            ipAddress,
            deviceId: deviceId || null
        });

        // Create new user
        const user = new User({
            name: name.trim(),
            email: cleanEmail,
            deviceId: deviceId ? deviceId.trim() : null,
            ipAddress,
            userAgent,

            riskScore: fraudResult.riskScore,
            riskLevel: fraudResult.riskLevel,
            action: fraudResult.action,
            linkedAccounts: fraudResult.linkedAccounts
        });

        await user.save();

        // Return result
        res.status(201).json({
            success: true,
            message: "User registered successfully",

            fraudDetection: {
                riskScore: fraudResult.riskScore,
                riskLevel: fraudResult.riskLevel,
                action: fraudResult.action,
                reasons: fraudResult.reasons
            },

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                riskScore: user.riskScore,
                riskLevel: user.riskLevel,
                action: user.action
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during signup"
        });
    }
});

module.exports = router;