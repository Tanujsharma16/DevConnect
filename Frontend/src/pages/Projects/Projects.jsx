import { useEffect, useState } from "react";
import {
    getMyProjects,
    deleteProject,
    acceptJoinRequest,
    rejectJoinRequest,
    updateMemberContribution,
} from "../../services/projectService";

import AddProjectModal from "../../components/projects/AddProjectModal";
import EditProjectModal from "../../components/projects/EditProjectModal";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contributions, setContributions] = useState({});
    const [updatingContribution, setUpdatingContribution] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await getMyProjects();
            setProjects(res.data.projects);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const ok = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!ok) return;

        try {
            await deleteProject(id);
            await fetchProjects();
        } catch (err) {
            console.log(err);
        }
    };
    const handleAcceptRequest = async (projectId, requestId) => {
    try {
        await acceptJoinRequest(projectId, requestId);

        alert("Developer added to the team!");

        await fetchProjects();
    } catch (error) {
        console.log(error);

        alert(
            error.response?.data?.message ||
            "Unable to accept request"
        );
    }
};

const handleRejectRequest = async (projectId, requestId) => {
    try {
        await rejectJoinRequest(projectId, requestId);

        alert("Join request rejected.");

        await fetchProjects();
    } catch (error) {
        console.log(error);

        alert(
            error.response?.data?.message ||
            "Unable to reject request"
        );
    }
};
const handleContributionChange = (
    memberId,
    field,
    value
) => {
    setContributions((prev) => ({
        ...prev,
        [memberId]: {
            ...prev[memberId],
            [field]: value,
        },
    }));
};

const handleUpdateContribution = async (
    projectId,
    member
) => {
    try {
        setUpdatingContribution(member._id);

        const data = contributions[member._id] || {};

        await updateMemberContribution(
            projectId,
            member._id,
            {
                contribution:
                    data.contribution ??
                    member.contribution ??
                    "",

                contributionStatus:
                    data.contributionStatus ??
                    member.contributionStatus ??
                    "not-started",
            }
        );

        alert("Contribution updated successfully!");

        await fetchProjects();

    } catch (error) {
        console.log(error);

        alert(
            error.response?.data?.message ||
            "Unable to update contribution"
        );
    } finally {
        setUpdatingContribution(null);
    }
};
    const getStatusStyle = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700";

            case "in-progress":
                return "bg-blue-100 text-blue-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "completed":
                return "Completed";

            case "in-progress":
                return "In Progress";

            default:
                return "Planning";
        }
    };

    if (loading) {
        return (
            <div className="text-center text-xl font-semibold mt-10">
                Loading...
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Projects
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your projects and build teams with other developers.
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
                >
                    + Add Project
                </button>

            </div>


            {/* No Projects */}

            {projects.length === 0 ? (

                <div className="bg-white p-12 rounded-2xl shadow text-center">

                    <div className="text-5xl mb-4">
                        🚀
                    </div>

                    <h2 className="text-2xl font-semibold">
                        No Projects Yet
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Create your first project and start building with other developers.
                    </p>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        Create Project
                    </button>

                </div>

            ) : (

                <div className="grid lg:grid-cols-2 gap-6">

                    {projects.map((project) => {

                        /*
                            Owner is also counted as a team member.

                            Example:
                            maxTeamSize = 5
                            accepted teamMembers = 2

                            Current Team = 3
                            Available Spots = 2
                        */

                        const currentTeamSize =
                            (project.teamMembers?.length || 0) + 1;

                        const maxTeamSize =
                            project.maxTeamSize || 1;

                        const availableSpots = Math.max(
                            maxTeamSize - currentTeamSize,
                            0
                        );

                        return (

                            <div
                                key={project._id}
                                className="bg-white rounded-2xl shadow border border-gray-100 p-6 hover:shadow-lg transition"
                            >

                                {/* Top Section */}

                                <div className="flex justify-between items-start gap-4">

                                    <div>

                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {project.title}
                                        </h2>

                                        <div className="flex flex-wrap gap-2 mt-3">

                                            {/* Status */}

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                    project.status
                                                )}`}
                                            >
                                                {getStatusText(project.status)}
                                            </span>


                                            {/* Collaboration Status */}

                                            {project.isOpenForCollaboration ? (

                                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Open for Collaboration
                                                </span>

                                            ) : (

                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Private Project
                                                </span>

                                            )}

                                        </div>

                                    </div>

                                </div>


                                {/* Description */}

                                <p className="mt-5 text-gray-600 leading-relaxed">
                                    {project.description}
                                </p>


                                {/* Tech Stack */}

                                {project.techStack?.length > 0 && (

                                    <div className="flex flex-wrap gap-2 mt-5">

                                        {project.techStack.map(
                                            (tech, index) => (

                                                <span
                                                    key={index}
                                                    className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {tech}
                                                </span>

                                            )
                                        )}

                                    </div>

                                )}


                                {/* Collaboration Details */}

                                {project.isOpenForCollaboration && (

                                    <div className="mt-6 border rounded-xl p-5 bg-gray-50">

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Team Members
                                                </p>

                                                <p className="text-xl font-bold mt-1">
                                                    {currentTeamSize} / {maxTeamSize}
                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Available Spots
                                                </p>

                                                <p className="text-xl font-bold mt-1">

                                                    {availableSpots > 0
                                                        ? availableSpots
                                                        : "Team Full"}

                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Join Requests
                                                </p>

                                                <p className="text-xl font-bold mt-1">

                                                    {
                                                        project.joinRequests?.filter(
                                                            (request) =>
                                                                request.status ===
                                                                "pending"
                                                        ).length || 0
                                                    }

                                                </p>

                                            </div>

                                        </div>


                                        {/* Required Roles */}

                                        {project.requiredRoles?.length > 0 && (

                                            <div className="mt-5">

                                                <h3 className="font-semibold text-gray-900">
                                                    Looking For
                                                </h3>

                                                <div className="space-y-3 mt-3">

                                                    {project.requiredRoles.map(
                                                        (role, index) => (

                                                            <div
                                                                key={
                                                                    role._id ||
                                                                    index
                                                                }
                                                                className="bg-white border rounded-lg p-3"
                                                            >

                                                                <div className="flex justify-between gap-3">

                                                                    <span className="font-semibold">
                                                                        {role.role}
                                                                    </span>

                                                                    {(() => {
    const acceptedForRole =
        project.teamMembers?.filter(
            (member) =>
                member.role === role.role
        ).length || 0;

    const remainingOpenings = Math.max(
        role.openings - acceptedForRole,
        0
    );

    return (
        <span
            className={`text-sm font-semibold ${
                remainingOpenings === 0
                    ? "text-red-600"
                    : "text-green-600"
            }`}
        >
            {remainingOpenings === 0
                ? "Role Full"
                : `${remainingOpenings} ${
                      remainingOpenings === 1
                          ? "opening"
                          : "openings"
                  } remaining`}
        </span>
    );
})()}

                                                                </div>


                                                                {role.skills?.length >
                                                                    0 && (

                                                                    <div className="flex flex-wrap gap-2 mt-2">

                                                                        {role.skills.map(
                                                                            (
                                                                                skill,
                                                                                skillIndex
                                                                            ) => (

                                                                                <span
                                                                                    key={
                                                                                        skillIndex
                                                                                    }
                                                                                    className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded"
                                                                                >
                                                                                    {
                                                                                        skill
                                                                                    }
                                                                                </span>

                                                                            )
                                                                        )}

                                                                    </div>

                                                                )}

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                )}


                                {/* Links */}

                                <div className="flex flex-wrap gap-4 mt-6">

                                    {project.githubLink && (

                                        <a
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-gray-800 hover:text-black font-semibold"
                                        >
                                            GitHub ↗
                                        </a>

                                    )}

                                    {project.liveLink && (

                                        <a
                                            href={project.liveLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-green-600 hover:text-green-700 font-semibold"
                                        >
                                            Live Demo ↗
                                        </a>

                                    )}

                                </div>
                                {/* Project Team */}

{/* Project Team */}

{project.teamMembers?.length > 0 && (

    <div className="mt-6 border-t pt-6">

        <h3 className="text-lg font-bold text-gray-900">
            Project Team
        </h3>

        <p className="text-sm text-gray-500 mt-1">
            Manage team members and track their contributions.
        </p>

        <div className="space-y-4 mt-4">

            {project.teamMembers.map((member, index) => (

                <div
                    key={member._id || index}
                    className="border rounded-xl p-4 bg-gray-50"
                >

                    {/* MEMBER INFO */}

                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                            <img
                                src={
                                    member.user?.photoUrl ||
                                    "https://ui-avatars.com/api/?name=Developer"
                                }
                                alt="Team Member"
                                className="w-12 h-12 rounded-full object-cover border"
                            />

                            <div>

                                <p className="font-bold text-gray-900">
                                    {member.user?.firstName}{" "}
                                    {member.user?.lastName}
                                </p>

                                <p className="text-sm text-purple-700 font-semibold">
                                    {member.role}
                                </p>

                            </div>

                        </div>


                        {member.user?._id && (

                            <button
                                onClick={() =>
                                    window.open(
                                        `/developers/${member.user._id}`,
                                        "_blank"
                                    )
                                }
                                className="border bg-white hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                                View Profile
                            </button>

                        )}

                    </div>


                    {/* CONTRIBUTION */}

                    <div className="mt-5">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Contribution
                        </label>

                        <textarea
                            rows="3"
                            placeholder="Describe this member's contribution..."
                            value={
                                contributions[member._id]
                                    ?.contribution ??
                                member.contribution ??
                                ""
                            }
                            onChange={(e) =>
                                handleContributionChange(
                                    member._id,
                                    "contribution",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg px-4 py-3 bg-white"
                        />

                    </div>


                    {/* CONTRIBUTION STATUS */}

                    <div className="mt-4">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Contribution Status
                        </label>

                        <select
                            value={
                                contributions[member._id]
                                    ?.contributionStatus ??
                                member.contributionStatus ??
                                "not-started"
                            }
                            onChange={(e) =>
                                handleContributionChange(
                                    member._id,
                                    "contributionStatus",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg px-4 py-3 bg-white"
                        >
                            <option value="not-started">
                                Not Started
                            </option>

                            <option value="in-progress">
                                In Progress
                            </option>

                            <option value="completed">
                                Completed
                            </option>
                        </select>

                    </div>


                    {/* CURRENT STATUS */}

                    <div className="mt-4">

                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                (
                                    contributions[member._id]
                                        ?.contributionStatus ??
                                    member.contributionStatus
                                ) === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : (
                                          contributions[member._id]
                                              ?.contributionStatus ??
                                          member.contributionStatus
                                      ) === "in-progress"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {(
                                contributions[member._id]
                                    ?.contributionStatus ??
                                member.contributionStatus
                            ) === "completed"
                                ? "Completed"
                                : (
                                      contributions[member._id]
                                          ?.contributionStatus ??
                                      member.contributionStatus
                                  ) === "in-progress"
                                ? "In Progress"
                                : "Not Started"}
                        </span>

                    </div>


                    {/* UPDATE BUTTON */}

                    <button
                        onClick={() =>
                            handleUpdateContribution(
                                project._id,
                                member
                            )
                        }
                        disabled={
                            updatingContribution === member._id
                        }
                        className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
                    >
                        {updatingContribution === member._id
                            ? "Updating..."
                            : "Update Contribution"}
                    </button>

                </div>

            ))}

        </div>

    </div>

)}
                                    {/* Pending Join Requests */}

{project.joinRequests?.filter(
    (request) => request.status === "pending"
).length > 0 && (

    <div className="mt-6 border-t pt-6">

        <h3 className="text-lg font-bold text-gray-900">
            Join Requests
        </h3>

        <p className="text-sm text-gray-500 mt-1">
            Developers who want to collaborate on this project.
        </p>

        <div className="space-y-4 mt-4">

            {project.joinRequests
                .filter(
                    (request) =>
                        request.status === "pending"
                )
                .map((request) => (

                    <div
                        key={request._id}
                        className="border rounded-xl p-4 bg-gray-50"
                    >

                        <div className="flex items-start gap-4">

                            <img
                                src={
                                    request.user?.photoUrl ||
                                    "https://ui-avatars.com/api/?name=Developer"
                                }
                                alt="Applicant"
                                className="w-12 h-12 rounded-full object-cover border"
                            />

                            <div className="flex-1">

                                <h4 className="font-bold">
                                    {request.user?.firstName}{" "}
                                    {request.user?.lastName}
                                </h4>

                                <p className="text-sm text-gray-500 mt-1">
                                    Wants to join as{" "}
                                    <span className="font-semibold text-purple-700">
                                        {request.role}
                                    </span>
                                </p>

                                {request.message && (

                                    <p className="text-gray-600 text-sm mt-3 bg-white p-3 rounded-lg border">
                                        "{request.message}"
                                    </p>

                                )}

                                {request.user?.skills?.length > 0 && (

                                    <div className="flex flex-wrap gap-2 mt-3">

                                        {request.user.skills.map(
                                            (skill, index) => (

                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                                                >
                                                    {skill}
                                                </span>

                                            )
                                        )}

                                    </div>

                                )}

                                <div className="flex flex-wrap gap-2 mt-4">

                                    <button
                                        onClick={() =>
                                            handleAcceptRequest(
                                                project._id,
                                                request._id
                                            )
                                        }
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                    >
                                        Accept
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleRejectRequest(
                                                project._id,
                                                request._id
                                            )
                                        }
                                        className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold"
                                    >
                                        Reject
                                    </button>

                                    {request.user?._id && (

                                        <button
                                            onClick={() =>
                                                window.open(
                                                    `/developers/${request.user._id}`,
                                                    "_blank"
                                                )
                                            }
                                            className="border hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold"
                                        >
                                            View Profile
                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

        </div>

    </div>

)}

                                {/* Actions */}

                                <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t">

                                    <button
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setShowEditModal(true);
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                                    >
                                        Edit Project
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(project._id)
                                        }
                                        className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2 rounded-lg"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}


            {/* Add Project Modal */}

            {showAddModal && (

                <AddProjectModal
                    onClose={() =>
                        setShowAddModal(false)
                    }
                    fetchProjects={fetchProjects}
                />

            )}


            {/* Edit Project Modal */}

            {showEditModal && selectedProject && (

                <EditProjectModal
                    project={selectedProject}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedProject(null);
                    }}
                    fetchProjects={fetchProjects}
                />

            )}

        </div>
    );
}

export default Projects;