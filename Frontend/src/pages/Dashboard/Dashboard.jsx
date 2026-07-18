import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    getMyProjects,
    getCollaboratingProjects,
} from "../../services/projectService";
function Dashboard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
const [collaborations, setCollaborations] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
    fetchDashboardData();
}, []);

const fetchDashboardData = async () => {
    try {
        const [projectsRes, collaborationsRes] =
            await Promise.all([
                getMyProjects(),
                getCollaboratingProjects(user._id),
            ]);

        setProjects(projectsRes.data.projects || []);
        setCollaborations(
            collaborationsRes.data.projects || []
        );
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="space-y-8">

            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow p-6">
                <h1 className="text-3xl font-bold">
                    Welcome, {user?.firstName} 👋
                </h1>
                <p className="text-gray-500 mt-2">
                    Manage your profile, projects and blogs from one place.
                </p>
            </div>

           {/* Stats */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-gray-500">
            Followers
        </h2>

        <p className="text-4xl font-bold mt-3">
            {user?.followers?.length || 0}
        </p>
    </div>

    <div className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-gray-500">
            Following
        </h2>

        <p className="text-4xl font-bold mt-3">
            {user?.following?.length || 0}
        </p>
    </div>

    <div className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-gray-500">
            My Projects
        </h2>

        <p className="text-4xl font-bold mt-3">
            {projects.length}
        </p>
    </div>

    <div className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-gray-500">
            My Collaborations
        </h2>

        <p className="text-4xl font-bold mt-3">
            {collaborations.length}
        </p>
    </div>

</div>

            {/* Recent Projects */}
           {/* Recent Projects */}

<div className="bg-white rounded-xl shadow p-6">

    <h2 className="text-2xl font-semibold mb-4">
        Recent Projects
    </h2>

    {loading ? (
        <p className="text-gray-500">
            Loading...
        </p>
    ) : projects.length === 0 ? (
        <p className="text-gray-500">
            No projects yet.
        </p>
    ) : (
        <div className="space-y-4">

            {projects
                .slice(-3)
                .reverse()
                .map((project) => (

                    <div
                        key={project._id}
                        className="border rounded-xl p-4"
                    >
                        <h3 className="text-lg font-bold">
                            {project.title}
                        </h3>

                        <p className="text-gray-500 mt-1">
                            {project.description}
                        </p>

                        {project.techStack?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">

                                {project.techStack.map(
                                    (tech, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                                        >
                                            {tech}
                                        </span>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                ))}

        </div>
    )}

</div>

           {/* Recent Collaborations */}

<div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-2xl font-semibold mb-4">
        Recent Collaborations
    </h2>

    {loading ? (
        <p className="text-gray-500">
            Loading...
        </p>
    ) : collaborations.length === 0 ? (
        <p className="text-gray-500">
            No collaborations yet.
        </p>
    ) : (
        <div className="space-y-4">
            {collaborations
                .slice(-3)
                .reverse()
                .map((project) => {
                    const myMember =
                        project.teamMembers?.find(
                            (member) =>
                                (
                                    member.user?._id ||
                                    member.user
                                )?.toString() ===
                                user?._id?.toString()
                        );

                    return (
                        <div
                            key={project._id}
                            className="border rounded-xl p-4"
                        >
                            <h3 className="text-lg font-bold">
                                {project.title}
                            </h3>

                            <p className="text-gray-500 mt-1">
                                {project.description}
                            </p>

                            {myMember && (
                                <div className="mt-3">
                                    <span className="text-sm text-gray-500">
                                        Role:
                                    </span>

                                    <span className="ml-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        {myMember.role}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
        </div>
    )}
</div>

        </div>
    );
}

export default Dashboard;