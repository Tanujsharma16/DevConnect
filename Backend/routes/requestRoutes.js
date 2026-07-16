const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    sendConnectionRequest,
} = require("../controllers/requestController");

router.post(
    "/send/:userId",
    authMiddleware,
    sendConnectionRequest
);

module.exports = router;