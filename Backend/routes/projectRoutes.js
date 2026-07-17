const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    createProject,
    getMyProjects,
    getProjectsByUser,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getMyProjects);

router.put("/:id", authMiddleware, updateProject);

router.delete("/:id", authMiddleware, deleteProject);
router.get(
    "/user/:userId",
    authMiddleware,
    getProjectsByUser
);

module.exports = router;