import { useEffect, useState } from "react";
import {
    getMyProjects,
    deleteProject,
} from "../../services/projectService";

import AddProjectModal from "../../components/projects/AddProjectModal";
import EditProjectModal from "../../components/projects/EditProjectModal";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

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
            "Delete this project?"
        );

        if (!ok) return;

        try {
            await deleteProject(id);
            fetchProjects();
        } catch (err) {
            console.log(err);
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
        <div className="space-y-6">

            <div className="flex justify-between items-center">

                <div>
                    <h1 className="text-3xl font-bold">
                        Projects
                    </h1>

                    <p className="text-gray-500">
                        Manage your projects
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                    + Add Project
                </button>

            </div>

            {projects.length === 0 ? (

                <div className="bg-white p-10 rounded-xl shadow text-center">

                    <h2 className="text-2xl font-semibold">
                        No Projects Yet 🚀
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Create your first project.
                    </p>

                </div>

            ) : (

                <div className="grid md:grid-cols-2 gap-6">

                    {projects.map((project) => (

                        <div
                            key={project._id}
                            className="bg-white rounded-xl shadow p-6"
                        >

                            <h2 className="text-2xl font-bold">
                                {project.title}
                            </h2>

                            <p className="mt-3 text-gray-600">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4">

                                {project.techStack.map((tech, i) => (

                                    <span
                                        key={i}
                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {tech}
                                    </span>

                                ))}

                            </div>

                            <div className="flex gap-4 mt-5">

                                {project.githubLink && (
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 font-semibold"
                                    >
                                        GitHub
                                    </a>
                                )}

                                {project.liveLink && (
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-green-600 font-semibold"
                                    >
                                        Live Demo
                                    </a>
                                )}

                            </div>

                            <div className="flex gap-3 mt-6">

                                <button
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setShowEditModal(true);
                                    }}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(project._id)
                                    }
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {showAddModal && (
                <AddProjectModal
                    onClose={() =>
                        setShowAddModal(false)
                    }
                    fetchProjects={fetchProjects}
                />
            )}

            {showEditModal && selectedProject && (
                <EditProjectModal
                    project={selectedProject}
                    onClose={() =>
                        setShowEditModal(false)
                    }
                    fetchProjects={fetchProjects}
                />
            )}

        </div>
    );
}

export default Projects;