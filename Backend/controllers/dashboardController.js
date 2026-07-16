const User = require("../models/User");
const Project = require("../models/Project");
const Blog = require("../models/Blog");

const getDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select("-password");

        const projectsCount = await Project.countDocuments({
            user: userId,
        });

        const blogsCount = await Blog.countDocuments({
            author: userId,
        });

        const recentProjects = await Project.find({
            user: userId,
        })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentBlogs = await Blog.find({
            author: userId,
        })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            user,
            stats: {
                projects: projectsCount,
                blogs: blogsCount,
                followers: user.followers
                    ? user.followers.length
                    : 0,
                following: user.following
                    ? user.following.length
                    : 0,
            },
            recentProjects,
            recentBlogs,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getDashboard,
};