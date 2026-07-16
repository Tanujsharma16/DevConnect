const axios = require("axios");
const User = require("../models/User");

const syncGithub = async (req, res) => {
    try {
        const { githubUsername } = req.body;

        const response = await axios.get(
            `https://api.github.com/users/${githubUsername}`
        );

        await User.findByIdAndUpdate(req.userId, {
            githubUsername,
            githubData: response.data,
        });

        res.status(200).json({
            success: true,
            message: "GitHub Synced Successfully",
            github: response.data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "GitHub User Not Found",
        });
    }
};

module.exports = {
    syncGithub,
};