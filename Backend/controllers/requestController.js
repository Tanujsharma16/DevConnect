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

module.exports = {
    sendConnectionRequest,
};