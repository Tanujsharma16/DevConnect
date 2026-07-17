const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getDevelopers ,getDeveloperById} = require("../controllers/developerController");

router.get("/", authMiddleware, getDevelopers);
router.get("/:id", authMiddleware, getDeveloperById);
module.exports = router;