require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/db");

// Resolve paths relative to this file
const authRoutes = require(path.join(__dirname, "routes", "authRoutes"));
const recordRoutes = require(path.join(__dirname, "routes", "recordRoutes"));
const dashboardRoutes = require(path.join(__dirname, "routes", "dashboardRoutes"));

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error("Database sync failed:", err);
});