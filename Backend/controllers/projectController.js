const Project = require("../models/Project");

// Create Project
const createProject = async (req, res) => {
    try {
        const project = await Project.create({
            ...req.body,
            user: req.userId,
        });

        res.status(201).json({
            success: true,
            message: "Project Created Successfully",
            project,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get My Projects
// Get My Projects
const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            user: req.userId,
        })
            .populate(
                "joinRequests.user",
                "firstName lastName photoUrl skills githubUsername"
            )
            .populate(
                "teamMembers.user",
                "firstName lastName photoUrl skills githubUsername"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
 // Get Projects By User ID
const getProjectsByUser = async (req, res) => {
    try {
        const projects = await Project.find({
            user: req.params.userId,
        });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get Projects Where User Is A Team Member
const getCollaboratingProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            "teamMembers.user": req.params.userId,
        })
            .populate(
                "user",
                "firstName lastName photoUrl"
            )
            .populate(
                "teamMembers.user",
                "firstName lastName photoUrl"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get My Collaboration Requests
const getMyCollaborationRequests = async (req, res) => {
    try {
        const projects = await Project.find({
            "joinRequests.user": req.userId,
        })
            .populate(
                "user",
                "firstName lastName photoUrl"
            )
            .select(
                "title description user joinRequests"
            )
            .sort({ createdAt: -1 });

        const requests = [];

        projects.forEach((project) => {
            project.joinRequests.forEach((request) => {

                if (
                    request.user.toString() ===
                    req.userId.toString()
                ) {
                    requests.push({
                        requestId: request._id,
                        projectId: project._id,
                        projectTitle: project.title,
                        projectDescription:
                            project.description,
                        owner: project.user,
                        role: request.role,
                        message: request.message,
                        status: request.status,
                    });
                }

            });
        });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get Open Collaboration Projects
const getCollaborationProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            isOpenForCollaboration: true,
        })
            .populate(
                "user",
                "firstName lastName photoUrl skills"
            )
            .populate(
                "teamMembers.user",
                "firstName lastName photoUrl"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Update Project
const updateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId,
            },
            req.body,
            {
                new: true,
            }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Project Updated Successfully",
            project,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            user: req.userId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Project Deleted Successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ================= JOIN PROJECT REQUEST =================
// ================= JOIN PROJECT REQUEST =================
const joinProject = async (req, res) => {
    try {
        const { role, message } = req.body;

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Please select a role",
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found",
            });
        }

        // Check if project is open for collaboration
        if (!project.isOpenForCollaboration) {
            return res.status(400).json({
                success: false,
                message: "Project is not open for collaboration",
            });
        }

        // Owner cannot join own project
        if (
            project.user.toString() ===
            req.userId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot join your own project",
            });
        }

        // Check if user is already a team member
        const alreadyMember = project.teamMembers.some(
            (member) =>
                member.user.toString() ===
                req.userId.toString()
        );

        if (alreadyMember) {
            return res.status(400).json({
                success: false,
                message: "You are already a team member",
            });
        }

        // Check if selected role exists
        const selectedRole = project.requiredRoles.find(
            (item) => item.role === role
        );

        if (!selectedRole) {
            return res.status(400).json({
                success: false,
                message:
                    "Selected role is not available for this project",
            });
        }

        // Count accepted members for selected role
        const acceptedForRole =
            project.teamMembers.filter(
                (member) => member.role === role
            ).length;

        // Check if selected role is full
        if (
            acceptedForRole >=
            selectedRole.openings
        ) {
            return res.status(400).json({
                success: false,
                message: `No openings available for ${role}`,
            });
        }

        // Check overall team capacity
        // +1 because project owner is also a team member
        const currentTeamSize =
            project.teamMembers.length + 1;

        if (
            currentTeamSize >=
            project.maxTeamSize
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Project team is already full",
            });
        }

        // Check for existing pending request
        const existingRequest =
            project.joinRequests.find(
                (request) =>
                    request.user.toString() ===
                        req.userId.toString() &&
                    request.status === "pending"
            );

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message:
                    "Join request already sent",
            });
        }

        // Create join request
        project.joinRequests.push({
            user: req.userId,
            role,
            message: message || "",
        });

        await project.save();

        res.status(200).json({
            success: true,
            message:
                "Join request sent successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= ACCEPT JOIN REQUEST =================
// ================= ACCEPT JOIN REQUEST =================
const acceptJoinRequest = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.userId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you are not the owner",
            });
        }

        // Find join request
        const request = project.joinRequests.id(
            req.params.requestId
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Join request not found",
            });
        }

        // Check if request is already processed
        if (request.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Request has already been processed",
            });
        }

        // Check if developer is already a team member
        const alreadyMember = project.teamMembers.some(
            (member) =>
                member.user.toString() ===
                request.user.toString()
        );

        if (alreadyMember) {
            return res.status(400).json({
                success: false,
                message: "Developer is already a team member",
            });
        }

        // Check overall team capacity
        // +1 because project owner is also counted
        const currentTeamSize =
            project.teamMembers.length + 1;

        if (currentTeamSize >= project.maxTeamSize) {
            return res.status(400).json({
                success: false,
                message: "Team is already full",
            });
        }

        // Find requested role
        const selectedRole = project.requiredRoles.find(
            (item) => item.role === request.role
        );

        if (!selectedRole) {
            return res.status(400).json({
                success: false,
                message: "Requested role is no longer available",
            });
        }

        // Count accepted members for requested role
        const acceptedForRole =
            project.teamMembers.filter(
                (member) =>
                    member.role === request.role
            ).length;

        // Check if requested role is full
        if (acceptedForRole >= selectedRole.openings) {
            return res.status(400).json({
                success: false,
                message: `No openings available for ${request.role}`,
            });
        }

        // Add developer to team
        project.teamMembers.push({
            user: request.user,
            role: request.role,
        });

        // Mark request as accepted
        request.status = "accepted";

        await project.save();

        res.status(200).json({
            success: true,
            message: "Developer added to project team",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ================= REJECT JOIN REQUEST =================
const rejectJoinRequest = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.userId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you are not the owner",
            });
        }

        const request = project.joinRequests.id(
            req.params.requestId
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Join request not found",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Request has already been processed",
            });
        }

        request.status = "rejected";

        await project.save();

        res.status(200).json({
            success: true,
            message: "Join request rejected",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ================= UPDATE MEMBER CONTRIBUTION =================
const updateMemberContribution = async (req, res) => {
    try {
        const { contribution, contributionStatus } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const member = project.teamMembers.id(
            req.params.memberId
        );

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Team member not found",
            });
        }

        // Only project owner or the team member can update
        const isOwner =
            project.user.toString() ===
            req.userId.toString();

        const isMember =
            member.user.toString() ===
            req.userId.toString();

        if (!isOwner && !isMember) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to update this contribution",
            });
        }

        if (contribution !== undefined) {
            member.contribution = contribution;
        }

        if (contributionStatus !== undefined) {
            member.contributionStatus =
                contributionStatus;
        }

        await project.save();

        res.status(200).json({
            success: true,
            message:
                "Contribution updated successfully",
            member,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    createProject,
    getMyProjects,
    getProjectsByUser,
    getCollaboratingProjects,
    updateProject,
    deleteProject,
    joinProject,
    acceptJoinRequest,
    rejectJoinRequest,
    getCollaborationProjects,
    getMyCollaborationRequests,
    updateMemberContribution,
};