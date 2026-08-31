const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        // Network information
        ipAddress: {
            type: String,
            default: null
        },

        // Device information
        deviceId: {
            type: String,
            default: null
        },

        userAgent: {
            type: String,
            default: null
        },

        // Signup information
        signupTime: {
            type: Date,
            default: Date.now
        },

        // Fraud detection
        riskScore: {
            type: Number,
            default: 0
        },

        riskLevel: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "LOW"
        },

        // Accounts that may belong to the same person
        linkedAccounts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        // Whether the user received the free credit
        creditClaimed: {
            type: Boolean,
            default: false
        },

        // Action taken by the system
        action: {
            type: String,
            enum: ["ALLOW", "REVIEW", "LIMIT"],
            default: "ALLOW"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);