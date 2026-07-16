const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { syncGithub } = require("../controllers/githubController");

router.post("/sync", authMiddleware, syncGithub);

module.exports = router;