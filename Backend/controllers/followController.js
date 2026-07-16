const User = require("../models/User");

// Follow User
const followUser = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
            });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (currentUser.following.includes(targetUserId)) {
            return res.status(400).json({
                success: false,
                message: "Already following this user",
            });
        }

        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: "User Followed Successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Unfollow User
const unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const targetUserId = req.params.id;

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        currentUser.following.pull(targetUserId);
        targetUser.followers.pull(currentUserId);

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: "User Unfollowed Successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    followUser,
    unfollowUser,
};