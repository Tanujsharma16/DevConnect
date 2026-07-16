const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getPendingRequests,
    getMyConnections,
    getFeed,
} = require("../controllers/requestController");
router.post(
    "/send/:userId",
    authMiddleware,
    sendConnectionRequest
);
router.post(
    "/accept/:requestId",
    authMiddleware,
    acceptConnectionRequest
);
router.post(
    "/reject/:requestId",
    authMiddleware,
    rejectConnectionRequest
);
router.get(
    "/pending",
    authMiddleware,
    getPendingRequests
);
router.get(
    "/connections",
    authMiddleware,
    getMyConnections
);
router.get(
    "/feed",
    authMiddleware,
    getFeed
);
module.exports = router;