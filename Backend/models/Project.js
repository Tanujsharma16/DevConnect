const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        // Project Owner
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        techStack: [
            {
                type: String,
                trim: true,
            },
        ],

        githubLink: {
            type: String,
            default: "",
        },

        liveLink: {
            type: String,
            default: "",
        },

        image: {
            type: String,
            default: "",
        },

        // ================= COLLABORATION =================

        // Is project accepting collaborators?
        isOpenForCollaboration: {
            type: Boolean,
            default: false,
        },
        maxTeamSize: {
    type: Number,
    default: 1,
    min: 1,
},
        // Roles required for this project
        requiredRoles: [
            {
                role: {
                    type: String,
                    required: true,
                    trim: true,
                },

                skills: [
                    {
                        type: String,
                        trim: true,
                    },
                ],

                openings: {
                    type: Number,
                    default: 1,
                    min: 1,
                },
            },
        ],

        // Accepted team members
        teamMembers: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },

                role: {
                    type: String,
                    default: "Developer",
                },
                contribution: {
    type: String,
    default: "",
    trim: true,
},

contributionStatus: {
    type: String,
    enum: [
        "not-started",
        "in-progress",
        "completed",
    ],
    default: "not-started",
},

joinedAt: {
    type: Date,
    default: Date.now,
},
                contribution: {
                    type: String,
                    default: "",
                },

                joinedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        // Developers requesting to join
        joinRequests: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },

                role: {
                    type: String,
                    required: true,
                },

                message: {
                    type: String,
                    default: "",
                    maxlength: 500,
                },

                status: {
                    type: String,
                    enum: ["pending", "accepted", "rejected"],
                    default: "pending",
                },

                requestedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        // Project Status
        status: {
            type: String,
            enum: ["planning", "in-progress", "completed"],
            default: "planning",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Project", projectSchema);