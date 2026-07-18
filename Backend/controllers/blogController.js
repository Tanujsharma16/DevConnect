const Blog = require("../models/Blog");


// ================= CREATE BLOG =================

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


// ================= GET ALL BLOGS =================

const getBlogs = async (req, res) => {
    try {
        const page =
            parseInt(req.query.page) || 1;

        const limit =
            parseInt(req.query.limit) || 10;

        const blogs = await Blog.find()
            .populate(
                "author",
                "firstName lastName photoUrl"
            )
            .populate(
                "comments.user",
                "firstName lastName photoUrl"
            )
            .sort({
                createdAt: -1,
            })
            .skip(
                (page - 1) * limit
            )
            .limit(limit);

        const total =
            await Blog.countDocuments();

        res.status(200).json({
            success: true,
            total,
            page,
            totalPages:
                Math.ceil(
                    total / limit
                ),
            blogs,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ================= GET BLOGS BY USER ID =================

const getBlogsByUser = async (req, res) => {
    try {
        const blogs = await Blog.find({
            author: req.params.userId,
        })
            .populate(
                "author",
                "firstName lastName photoUrl"
            )
            .sort({
                createdAt: -1,
            });

        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET SINGLE BLOG =================

const getBlog = async (req, res) => {
    try {
        const blog =
            await Blog.findById(
                req.params.id
            )
                .populate(
                    "author",
                    "firstName lastName photoUrl"
                )
                .populate(
                    "comments.user",
                    "firstName lastName photoUrl"
                );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message:
                    "Blog Not Found",
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


// ================= UPDATE BLOG =================

const updateBlog = async (req, res) => {
    try {
        const blog =
            await Blog.findOneAndUpdate(
                {
                    _id: req.params.id,
                    author: req.userId,
                },
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message:
                    "Blog Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Blog Updated Successfully",
            blog,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================= DELETE BLOG =================

const deleteBlog = async (req, res) => {
    try {
        const blog =
            await Blog.findOneAndDelete({
                _id: req.params.id,
                author: req.userId,
            });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message:
                    "Blog Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Blog Deleted Successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================= LIKE / UNLIKE BLOG =================

const likeBlog = async (req, res) => {
    try {
        const blog =
            await Blog.findById(
                req.params.id
            );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message:
                    "Blog Not Found",
            });
        }

        const alreadyLiked =
            blog.likes.some(
                (userId) =>
                    userId.toString() ===
                    req.userId.toString()
            );

        if (alreadyLiked) {
            blog.likes.pull(
                req.userId
            );

            await blog.save();

            return res.status(200).json({
                success: true,
                message:
                    "Blog Unliked",
                likes:
                    blog.likes.length,
            });
        }

        blog.likes.push(
            req.userId
        );

        await blog.save();

        res.status(200).json({
            success: true,
            message:
                "Blog Liked",
            likes:
                blog.likes.length,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================= ADD COMMENT =================

const addComment = async (req, res) => {
    try {
        const { text } =
            req.body;

        if (
            !text ||
            !text.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Comment cannot be empty",
            });
        }

        const blog =
            await Blog.findById(
                req.params.id
            );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message:
                    "Blog Not Found",
            });
        }

        blog.comments.push({
            user: req.userId,
            text: text.trim(),
        });

        await blog.save();

        // Populate user details before returning comments
        await blog.populate(
            "comments.user",
            "firstName lastName photoUrl"
        );

        res.status(200).json({
            success: true,
            message:
                "Comment Added Successfully",
            comments:
                blog.comments,
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
    getBlogsByUser,
};