import { useState } from "react";
import { createProject } from "../../services/projectService";

function AddProjectModal({ onClose, fetchProjects }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
        liveLink: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await createProject({
                ...formData,
                techStack: formData.techStack
                    .split(",")
                    .map((tech) => tech.trim())
                    .filter(Boolean),
            });

            fetchProjects();
            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">

                <h2 className="text-2xl font-bold mb-6">
                    Add New Project
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input
                        type="text"
                        name="title"
                        placeholder="Project Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    <textarea
                        name="description"
                        placeholder="Project Description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    <input
                        type="text"
                        name="techStack"
                        placeholder="React, Node, MongoDB"
                        value={formData.techStack}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    <input
                        type="url"
                        name="githubLink"
                        placeholder="GitHub Link"
                        value={formData.githubLink}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    <input
                        type="url"
                        name="liveLink"
                        placeholder="Live Demo Link"
                        value={formData.liveLink}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg border"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {loading ? "Saving..." : "Save Project"}
                        </button>

                    </div>
                </form>

            </div>
        </div>
    );
}

export default AddProjectModal;