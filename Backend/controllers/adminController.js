const User = require("../models/User");

// ================= GET ADMIN DASHBOARD STATS =================

const getAdminStats = async (req, res) => {
    try {
        const users = await User.find()
            .select("isEmailVerified")
            .lean();

        const totalUsers = users.length;

        const verifiedUsers = users.filter(
            (user) =>
                user.isEmailVerified === true ||
                user.isEmailVerified === "true"
        ).length;

        const unverifiedUsers =
            totalUsers - verifiedUsers;

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                verifiedUsers,
                unverifiedUsers,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL REGISTERED USERS =================

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select(
                "firstName lastName email photoUrl role isEmailVerified createdAt"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    getAdminStats,
    getAllUsers,
};