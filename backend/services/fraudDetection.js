const User = require("../models/user");

async function calculateRisk({ ipAddress, deviceId }) {
    let riskScore = 0;
    const reasons = [];
    const linkedAccounts = [];

    // Check for matching IP
    if (ipAddress) {
        const sameIPUsers = await User.find({
            ipAddress: ipAddress
        });

        if (sameIPUsers.length > 0) {
            riskScore += 30;
            reasons.push("IP address already used by another account");

            sameIPUsers.forEach((user) => {
                linkedAccounts.push(user._id);
            });
        }
    }

    // Check for matching device
    if (deviceId) {
        const sameDeviceUsers = await User.find({
            deviceId: deviceId
        });

        if (sameDeviceUsers.length > 0) {
            riskScore += 50;
            reasons.push("Device already used by another account");

            sameDeviceUsers.forEach((user) => {
                if (!linkedAccounts.some((id) => id.equals(user._id))) {
                    linkedAccounts.push(user._id);
                }
            });
        }
    }

    // Prevent score from exceeding 100
    riskScore = Math.min(riskScore, 100);

    let riskLevel;
    let action;

    if (riskScore < 30) {
        riskLevel = "LOW";
        action = "ALLOW";
    } else if (riskScore < 60) {
        riskLevel = "MEDIUM";
        action = "REVIEW";
    } else {
        riskLevel = "HIGH";
        action = "LIMIT";
    }

    return {
        riskScore,
        riskLevel,
        action,
        reasons,
        linkedAccounts
    };
}

module.exports = calculateRisk;
