const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    followUser,
    unfollowUser,
} = require("../controllers/followController");

router.put("/follow/:id", authMiddleware, followUser);

router.put("/unfollow/:id", authMiddleware, unfollowUser);

module.exports = router;