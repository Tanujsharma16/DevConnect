const User = require("../models/User");

const getDevelopers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skill = req.query.skill || "";

        let query = {};

        // Search by Name
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
            ];
        }

        // Search by Skill
        if (skill) {
            query.skills = {
                $regex: skill,
                $options: "i",
            };
        }

        const developers = await User.find(query)
            .select("-password")
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            developers,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getDeveloperById = async (req, res) => {
    try {
        const developer = await User.findById(req.params.id)
            .select("-password");

        if (!developer) {
            return res.status(404).json({
                success: false,
                message: "Developer not found",
            });
        }

        res.status(200).json({
            success: true,
            developer,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    getDevelopers,
    getDeveloperById,
};