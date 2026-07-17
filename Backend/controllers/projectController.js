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
const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            user: req.userId,
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

module.exports = {
    createProject,
    getMyProjects,
    getProjectsByUser,
    updateProject,
    deleteProject,
};