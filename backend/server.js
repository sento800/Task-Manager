require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const connectDB = require("./config/db.js");

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes
// PATH /api/v1/auth
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
// app.use("/api/v1/reports", reportRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
