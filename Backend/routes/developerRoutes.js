const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getDevelopers } = require("../controllers/developerController");

router.get("/", authMiddleware, getDevelopers);

module.exports = router;