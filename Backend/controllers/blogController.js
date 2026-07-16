const Blog = require("../models/Blog");

// Create Blog
const createBlog = async (req, res) => {
    try {
        const blog = await Blog.create({
            ...req.body,
            author: req.userId,
        });

        res.status(201).json({
            success: true,
            message: "Blog Created Successfully",
            blog,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Blogs
const getBlogs = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const blogs = await Blog.find()
            .populate("author", "firstName lastName photoUrl")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Blog.countDocuments();

        res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            blogs,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Single Blog
const getBlog = async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id)
            .populate("author", "firstName lastName photoUrl");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog Not Found",
            });
        }

        res.status(200).json({
            success: true,
            blog,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Blog
const updateBlog = async (req, res) => {
    try {

        const blog = await Blog.findOneAndUpdate(
            {
                _id: req.params.id,
                author: req.userId,
            },
            req.body,
            {
                new: true,
            }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog Updated Successfully",
            blog,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Blog
const deleteBlog = async (req, res) => {
    try {

        const blog = await Blog.findOneAndDelete({
            _id: req.params.id,
            author: req.userId,
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog Deleted Successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog Not Found",
            });
        }

        const alreadyLiked = blog.likes.includes(req.userId);

        if (alreadyLiked) {
            blog.likes.pull(req.userId);

            await blog.save();

            return res.status(200).json({
                success: true,
                message: "Blog Unliked",
                likes: blog.likes.length,
            });
        }

        blog.likes.push(req.userId);

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog Liked",
            likes: blog.likes.length,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog Not Found",
            });
        }

        blog.comments.push({
            user: req.userId,
            text,
        });

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Comment Added Successfully",
            comments: blog.comments,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    addComment,
};