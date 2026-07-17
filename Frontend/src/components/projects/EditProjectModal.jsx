import { useState } from "react";
import { updateProject } from "../../services/projectService";

function EditProjectModal({
    project,
    onClose,
    fetchProjects,
}) {
    const [formData, setFormData] = useState({
        title: project.title,
        description: project.description,
        techStack: project.techStack.join(", "),
        githubLink: project.githubLink,
        liveLink: project.liveLink,
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

            await updateProject(project._id, {
                ...formData,
                techStack: formData.techStack
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            });

            fetchProjects();
            onClose();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">

                <h2 className="text-2xl font-bold mb-5">
                    Edit Project
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <textarea
                        rows="4"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="techStack"
                        value={formData.techStack}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="githubLink"
                        value={formData.githubLink}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="liveLink"
                        value={formData.liveLink}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default EditProjectModal;