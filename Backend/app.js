const express = require("express");
const githubRoutes = require("./routes/githubRoutes");
const cors = require("cors");
const requestRoutes = require("./routes/requestRoutes");
const projectRoutes = require("./routes/projectRoutes");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const app = express();
const developerRoutes = require("./routes/developerRoutes");
// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/projects", projectRoutes);
app.use("/api/github", githubRoutes);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);
app.use("/api/developers", developerRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);
// Test Route
app.get("/", (req, res) => {
    res.send("🚀 DevConnect Backend is Running");
});

module.exports = app;