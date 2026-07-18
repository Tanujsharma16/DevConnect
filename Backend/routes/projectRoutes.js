const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createProject,
    getMyProjects,
    getProjectsByUser,
    updateProject,
    deleteProject,
    joinProject,
    acceptJoinRequest,
    rejectJoinRequest,
    getCollaborationProjects,
    getCollaboratingProjects,
    getMyCollaborationRequests,
    updateMemberContribution,
} = require("../controllers/projectController");


// ================= PROJECT ROUTES =================

// Create Project
router.post("/", authMiddleware, createProject);

// Get My Projects
router.get("/", authMiddleware, getMyProjects);

// Get Projects By User
router.get(
    "/user/:userId",
    authMiddleware,
    getProjectsByUser
);

// Send Join Request
router.post(
    "/:id/join",
    authMiddleware,
    joinProject
);

// Accept Join Request
router.put(
    "/:id/requests/:requestId/accept",
    authMiddleware,
    acceptJoinRequest
);

// Reject Join Request
router.put(
    "/:id/requests/:requestId/reject",
    authMiddleware,
    rejectJoinRequest
);

// Update Project
router.put(
    "/:id",
    authMiddleware,
    updateProject
);

// Delete Project
router.delete(
    "/:id",
    authMiddleware,
    deleteProject
);
router.get(
    "/collaboration",
    authMiddleware,
    getCollaborationProjects
);
router.get(
    "/collaborating/:userId",
    authMiddleware,
    getCollaboratingProjects
);
router.get(
    "/my-collaboration-requests",
    authMiddleware,
    getMyCollaborationRequests
);
router.put(
    "/:id/members/:memberId/contribution",
    authMiddleware,
    updateMemberContribution
);
module.exports = router;