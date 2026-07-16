const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

const sendConnectionRequest = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.userId;

        // Cannot send request to yourself
        if (senderId === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send request to yourself",
            });
        }

        // Check receiver exists
        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if request already exists
      const existingRequest = await ConnectionRequest.findOne({
    $or: [
        {
            sender: senderId,
            receiver: receiverId,
        },
        {
            sender: receiverId,
            receiver: senderId,
        },
    ],
});

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "Connection request already sent",
            });
        }

        const request = await ConnectionRequest.create({
            sender: senderId,
            receiver: receiverId,
        });

        res.status(201).json({
            success: true,
            message: "Connection Request Sent Successfully",
            request,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const acceptConnectionRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;

        const request = await ConnectionRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Connection Request Not Found",
            });
        }

        // Sirf receiver hi accept kar sakta hai
        if (request.receiver.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized",
            });
        }

        request.status = "accepted";

        await request.save();

        res.status(200).json({
            success: true,
            message: "Connection Request Accepted",
            request,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const rejectConnectionRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;

        const request = await ConnectionRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Connection Request Not Found",
            });
        }

        // Sirf receiver hi reject kar sakta hai
        if (request.receiver.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized",
            });
        }

        request.status = "rejected";

        await request.save();

        res.status(200).json({
            success: true,
            message: "Connection Request Rejected",
            request,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getPendingRequests = async (req, res) => {
    try {

        const requests = await ConnectionRequest.find({
            receiver: req.userId,
            status: "pending",
        }).populate(
            "sender",
            "firstName lastName email about skills"
        );

        res.status(200).json({
            success: true,
            count: requests.length,
            requests,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getMyConnections = async (req, res) => {
    try {

        const connections = await ConnectionRequest.find({
            status: "accepted",
            $or: [
                { sender: req.userId },
                { receiver: req.userId }
            ]
        })
        .populate("sender", "firstName lastName email about skills")
        .populate("receiver", "firstName lastName email about skills");

        res.status(200).json({
            success: true,
            count: connections.length,
            connections,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getFeed = async (req, res) => {
    try {
        const userId = req.userId;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Step 1
        // Get all requests where current user is sender or receiver

        const requests = await ConnectionRequest.find({
            $or: [
                { sender: userId },
                { receiver: userId },
            ],
        });

        // Remaining logic next step...

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getPendingRequests,
    getMyConnections,
};