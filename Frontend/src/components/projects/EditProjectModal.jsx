import { useState } from "react";
import { updateProject } from "../../services/projectService";

function EditProjectModal({
    project,
    onClose,
    fetchProjects,
}) {
    const [formData, setFormData] = useState({
        title: project.title || "",
        description: project.description || "",
        techStack: project.techStack?.join(", ") || "",
        githubLink: project.githubLink || "",
        liveLink: project.liveLink || "",
        isOpenForCollaboration:
            project.isOpenForCollaboration || false,
        maxTeamSize: project.maxTeamSize || 1,
        status: project.status || "planning",
    });

    const [requiredRoles, setRequiredRoles] = useState(
        project.requiredRoles?.map((item) => ({
            role: item.role || "",
            skills: item.skills?.join(", ") || "",
            openings: item.openings || 1,
        })) || []
    );

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        });
    };

    const addRole = () => {
        setRequiredRoles([
            ...requiredRoles,
            {
                role: "",
                skills: "",
                openings: 1,
            },
        ]);
    };

    const handleRoleChange = (
        index,
        field,
        value
    ) => {
        const updatedRoles = [
            ...requiredRoles,
        ];

        updatedRoles[index] = {
            ...updatedRoles[index],
            [field]: value,
        };

        setRequiredRoles(updatedRoles);
    };

    const removeRole = (index) => {
        setRequiredRoles(
            requiredRoles.filter(
                (_, i) => i !== index
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formattedRoles =
                requiredRoles.map(
                    (item) => ({
                        role: item.role.trim(),

                        skills: item.skills
                            .split(",")
                            .map((skill) =>
                                skill.trim()
                            )
                            .filter(Boolean),

                        openings: Number(
                            item.openings
                        ),
                    })
                );

            await updateProject(
                project._id,
                {
                    ...formData,

                    maxTeamSize: Number(
                        formData.maxTeamSize
                    ),

                    techStack:
                        formData.techStack
                            .split(",")
                            .map((tech) =>
                                tech.trim()
                            )
                            .filter(Boolean),

                    requiredRoles:
                        formData.isOpenForCollaboration
                            ? formattedRoles
                            : [],
                }
            );

            await fetchProjects();

            onClose();

        } catch (err) {
            console.log(err);

            alert(
                err.response?.data?.message ||
                "Unable to update project"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}

                <div className="p-6 border-b">

                    <h2 className="text-2xl font-bold">
                        Edit Project
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Update your project and collaboration settings.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5"
                >

                    {/* Title */}

                    <div>

                        <label className="block font-semibold mb-2">
                            Project Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-3"
                        />

                    </div>


                    {/* Description */}

                    <div>

                        <label className="block font-semibold mb-2">
                            Description
                        </label>

                        <textarea
                            rows="4"
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-3"
                        />

                    </div>


                    {/* Tech Stack */}

                    <div>

                        <label className="block font-semibold mb-2">
                            Tech Stack
                        </label>

                        <input
                            type="text"
                            name="techStack"
                            value={
                                formData.techStack
                            }
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                            className="w-full border rounded-lg px-4 py-3"
                        />

                    </div>


                    {/* GitHub */}

                    <div>

                        <label className="block font-semibold mb-2">
                            GitHub Repository
                        </label>

                        <input
                            type="url"
                            name="githubLink"
                            value={
                                formData.githubLink
                            }
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3"
                        />

                    </div>


                    {/* Live Demo */}

                    <div>

                        <label className="block font-semibold mb-2">
                            Live Demo
                        </label>

                        <input
                            type="url"
                            name="liveLink"
                            value={
                                formData.liveLink
                            }
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3"
                        />

                    </div>


                    {/* Project Status */}

                    <div>

                        <label className="block font-semibold mb-2">
                            Project Status
                        </label>

                        <select
                            name="status"
                            value={
                                formData.status
                            }
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 bg-white"
                        >
                            <option value="planning">
                                Planning
                            </option>

                            <option value="in-progress">
                                In Progress
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                        </select>

                    </div>


                    {/* Collaboration Section */}

                    <div className="border rounded-xl p-5 bg-gray-50">

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <h3 className="font-bold text-lg">
                                    Open for Collaboration
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Allow developers to request to join your project.
                                </p>

                            </div>

                            <input
                                type="checkbox"
                                name="isOpenForCollaboration"
                                checked={
                                    formData.isOpenForCollaboration
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-5 h-5"
                            />

                        </div>


                        {formData.isOpenForCollaboration && (

                            <div className="mt-6 space-y-6">

                                {/* Team Size */}

                                <div>

                                    <label className="block font-semibold mb-2">
                                        Maximum Team Size
                                    </label>

                                    <input
                                        type="number"
                                        name="maxTeamSize"
                                        min="2"
                                        value={
                                            formData.maxTeamSize
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full border rounded-lg px-4 py-3 bg-white"
                                    />

                                    <p className="text-sm text-gray-500 mt-1">
                                        Team size includes you as the project owner.
                                    </p>

                                </div>


                                {/* Required Roles */}

                                <div>

                                    <div className="flex items-center justify-between gap-4 mb-4">

                                        <div>

                                            <h3 className="font-bold">
                                                Required Team Members
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                Manage the roles required for your project.
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                addRole
                                            }
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            + Add Role
                                        </button>

                                    </div>


                                    {requiredRoles.length === 0 && (

                                        <div className="border border-dashed rounded-lg p-5 text-center text-gray-500">
                                            No roles added yet.
                                        </div>

                                    )}


                                    <div className="space-y-4">

                                        {requiredRoles.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="bg-white border rounded-xl p-4"
                                                >

                                                    <div className="flex justify-between items-center mb-4">

                                                        <h4 className="font-semibold">
                                                            Role{" "}
                                                            {index +
                                                                1}
                                                        </h4>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeRole(
                                                                    index
                                                                )
                                                            }
                                                            className="text-red-600 text-sm font-semibold"
                                                        >
                                                            Remove
                                                        </button>

                                                    </div>


                                                    <div className="space-y-3">

                                                        <input
                                                            type="text"
                                                            placeholder="Frontend Developer"
                                                            value={
                                                                item.role
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                handleRoleChange(
                                                                    index,
                                                                    "role",
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            required
                                                            className="w-full border rounded-lg px-4 py-3"
                                                        />


                                                        <input
                                                            type="text"
                                                            placeholder="React, Tailwind CSS, JavaScript"
                                                            value={
                                                                item.skills
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                handleRoleChange(
                                                                    index,
                                                                    "skills",
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full border rounded-lg px-4 py-3"
                                                        />


                                                        <div>

                                                            <label className="text-sm font-medium">
                                                                Number of Openings
                                                            </label>

                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    item.openings
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleRoleChange(
                                                                        index,
                                                                        "openings",
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full border rounded-lg px-4 py-3 mt-1"
                                                            />

                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* Buttons */}

                    <div className="flex justify-end gap-3 pt-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-5 py-3 rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Updating..."
                                : "Update Project"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditProjectModal;