const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const signupRoute = require("./routes/signup");
const adminRoute = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", signupRoute);
app.use("/api/admin", adminRoute);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Fraud Detection API Running"
    });
});

// Start server after MongoDB connects
async function startServer() {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB Connected Successfully");

        app.listen(process.env.PORT, () => {
            console.log(
                `Server running on http://localhost:${process.env.PORT}`
            );
        });

    } catch (error) {
        console.log("MongoDB Connection Failed");
        console.log("Error name:", error.name);
        console.log("Error message:", error.message);
        console.log("Error code:", error.code);
    }
}

startServer();