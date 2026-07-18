const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createBlog,
    getBlogs,
    getBlogsByUser,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,

    addComment,
} = require("../controllers/blogController");

router.post("/", authMiddleware, createBlog);

router.get("/", getBlogs);
router.get("/user/:userId", getBlogsByUser);

router.get("/:id", getBlog);

router.put("/:id", authMiddleware, updateBlog);

router.delete("/:id", authMiddleware, deleteBlog);
router.put("/like/:id", authMiddleware, likeBlog);
router.post("/comment/:id", authMiddleware, addComment);
module.exports = router;