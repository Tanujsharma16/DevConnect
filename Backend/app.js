const express = require("express");
const githubRoutes = require("./routes/githubRoutes");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const requestRoutes = require("./routes/requestRoutes");
const projectRoutes = require("./routes/projectRoutes");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const app = express();
const developerRoutes = require("./routes/developerRoutes");
const blogRoutes = require("./routes/blogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const followRoutes = require("./routes/followRoutes");
// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
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
app.use("/api/users", followRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/developers", developerRoutes);
app.use("/api/blogs", blogRoutes);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/admin", adminRoutes);
// Test Route
app.get("/", (req, res) => {
    res.send("🚀 DevConnect Backend is Running");
});
const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);
module.exports = app;