import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDeveloperById } from "../../services/developerService";
import {
    getProjectsByUser,
    getCollaboratingProjects,
} from "../../services/projectService";

function DeveloperProfile() {
    const { id } = useParams();

    const [developer, setDeveloper] = useState(null);
    const [projects, setProjects] = useState([]);
    const [collaboratingProjects, setCollaboratingProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeveloper();
    }, [id]);

    const fetchDeveloper = async () => {
        try {
            setLoading(true);

            // Developer details
            const developerRes = await getDeveloperById(id);
            setDeveloper(developerRes.data.developer);

            // Developer ke khud ke projects
            const projectRes = await getProjectsByUser(id);
            setProjects(projectRes.data.projects || []);

            // Projects jisme developer team member hai
            const collaboratingRes =
                await getCollaboratingProjects(id);

            setCollaboratingProjects(
                collaboratingRes.data.projects || []
            );

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center text-2xl mt-10">
                Loading...
            </div>
        );
    }

    if (!developer) {
        return (
            <div className="text-center text-2xl mt-10">
                Developer not found.
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* PROFILE HEADER */}

            <div className="bg-white rounded-2xl shadow overflow-hidden">

                <div className="h-36 bg-gradient-to-r from-blue-600 to-purple-600" />

                <div className="p-8">

                    <div className="flex flex-col md:flex-row gap-6 -mt-20">

                        <img
                            src={
                                developer.photoUrl ||
                                "https://ui-avatars.com/api/?name=Developer"
                            }
                            alt="Developer"
                            className="w-36 h-36 rounded-full object-cover border-4 border-white bg-white"
                        />

                        <div className="md:mt-16">

                            <h1 className="text-3xl font-bold">
                                {developer.firstName}{" "}
                                {developer.lastName}
                            </h1>

                            <p className="mt-2 text-gray-600">
                                {developer.about ||
                                    "No description added."}
                            </p>

                        </div>

                    </div>


                    {/* SKILLS */}

                    <div className="mt-8">

                        <h2 className="text-xl font-bold">
                            Skills
                        </h2>

                        <div className="flex flex-wrap gap-2 mt-3">

                            {developer.skills?.length > 0 ? (

                                developer.skills.map(
                                    (skill, index) => (

                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                                        >
                                            {skill}
                                        </span>

                                    )
                                )

                            ) : (

                                <p className="text-gray-500">
                                    No skills added.
                                </p>

                            )}

                        </div>

                    </div>


                    {/* LINKS */}

                    <div className="flex flex-wrap gap-3 mt-8">

                        {developer.githubUsername && (

                            <a
                                href={`https://github.com/${developer.githubUsername}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-gray-900 text-white px-5 py-2 rounded-lg"
                            >
                                GitHub Profile
                            </a>

                        )}

                        {developer.linkedin && (

                            <a
                                href={developer.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                            >
                                LinkedIn
                            </a>

                        )}

                        {developer.portfolio && (

                            <a
                                href={developer.portfolio}
                                target="_blank"
                                rel="noreferrer"
                                className="border px-5 py-2 rounded-lg hover:bg-gray-100"
                            >
                                Portfolio
                            </a>

                        )}

                    </div>

                </div>

            </div>


            {/* GITHUB PROFILE */}

            {developer.githubData &&
                developer.githubUsername && (

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="text-2xl font-bold mb-5">
                            GitHub Profile
                        </h2>

                        <div className="flex flex-col md:flex-row gap-6">

                            {developer.githubData.avatarUrl && (

                                <img
                                    src={
                                        developer.githubData.avatarUrl
                                    }
                                    alt="GitHub"
                                    className="w-24 h-24 rounded-full object-cover border"
                                />

                            )}

                            <div className="flex-1">

                                <h3 className="text-xl font-bold">
                                    {developer.githubData.name ||
                                        developer.githubUsername}
                                </h3>

                                <p className="text-gray-600 mt-2">
                                    {developer.githubData.bio ||
                                        "No GitHub bio available."}
                                </p>

                                <div className="flex flex-wrap gap-8 mt-5">

                                    <div>
                                        <p className="font-bold text-xl">
                                            {developer.githubData.publicRepos ||
                                                0}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            Repositories
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-xl">
                                            {developer.githubData.followers ||
                                                0}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            Followers
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-xl">
                                            {developer.githubData.following ||
                                                0}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            Following
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                )}


            {/* OWN PROJECTS */}

            <div>

                <h2 className="text-3xl font-bold mb-5">
                    Projects
                </h2>

                {projects.length === 0 ? (

                    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                        No projects added yet.
                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 gap-6">

                        {projects.map((project) => (

                            <div
                                key={project._id}
                                className="bg-white rounded-2xl shadow p-6"
                            >

                                <div className="flex justify-between gap-3">

                                    <h3 className="text-2xl font-bold">
                                        {project.title}
                                    </h3>

                                    {project.isOpenForCollaboration && (

                                        <span className="h-fit bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            Open for Collaboration
                                        </span>

                                    )}

                                </div>

                                <p className="text-gray-600 mt-3">
                                    {project.description}
                                </p>


                                {/* TECH STACK */}

                                {project.techStack?.length > 0 && (

                                    <div className="flex flex-wrap gap-2 mt-4">

                                        {project.techStack.map(
                                            (tech, index) => (

                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {tech}
                                                </span>

                                            )
                                        )}

                                    </div>

                                )}


                                {/* COLLABORATION INFO */}

                                {project.isOpenForCollaboration && (

                                    <div className="mt-5 bg-purple-50 rounded-xl p-4">

                                        <p className="font-semibold text-purple-800">
                                            Looking for collaborators
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">
                                            Team Size:{" "}
                                            {(project.teamMembers?.length ||
                                                0) + 1}
                                            {" / "}
                                            {project.maxTeamSize}
                                        </p>

                                        {project.requiredRoles?.length >
                                            0 && (

                                                <div className="mt-3">

                                                    <p className="text-sm font-semibold">
                                                        Roles:
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mt-2">

                                                        {project.requiredRoles.map(
                                                            (
                                                                role,
                                                                index
                                                            ) => (

                                                                <span
                                                                    key={
                                                                        role._id ||
                                                                        index
                                                                    }
                                                                    className="bg-white text-purple-700 px-3 py-1 rounded-full text-xs border"
                                                                >
                                                                    {role.role}
                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                            )}

                                    </div>

                                )}


                                {/* PROJECT LINKS */}

                                <div className="flex gap-4 mt-5">

                                    {project.githubLink && (

                                        <a
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 font-semibold"
                                        >
                                            GitHub ↗
                                        </a>

                                    )}

                                    {project.liveLink && (

                                        <a
                                            href={project.liveLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-green-600 font-semibold"
                                        >
                                            Live Demo ↗
                                        </a>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* PROJECTS I'M COLLABORATING ON */}

            <div>

                <h2 className="text-3xl font-bold mb-5">
                    Projects I'm Collaborating On
                </h2>

                {collaboratingProjects.length === 0 ? (

                    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                        Not collaborating on any projects yet.
                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 gap-6">

                        {collaboratingProjects.map((project) => {

                            const myTeamMember =
                                project.teamMembers?.find(
                                    (member) =>
                                        member.user?._id === id
                                );

                            return (

                                <div
                                    key={project._id}
                                    className="bg-white rounded-2xl shadow p-6"
                                >

                                    <h3 className="text-2xl font-bold">
                                        {project.title}
                                    </h3>

                                    <p className="text-gray-600 mt-3">
                                        {project.description}
                                    </p>


                                    {/* ROLE */}
{/* ROLE + CONTRIBUTION */}

{myTeamMember && (

    <div className="mt-5 space-y-4">

        {/* ROLE */}

        <div>
            <span className="text-sm text-gray-500">
                Collaborating as:
            </span>

            <span className="ml-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                {myTeamMember.role}
            </span>
        </div>


        {/* CONTRIBUTION */}

        <div className="bg-gray-50 rounded-xl p-4">

            <p className="text-sm font-semibold text-gray-700">
                Contribution
            </p>

            <p className="text-gray-600 mt-2">
                {myTeamMember.contribution ||
                    "No contribution details added yet."}
            </p>

        </div>


        {/* CONTRIBUTION STATUS */}

        <div>

            <span className="text-sm text-gray-500 mr-2">
                Status:
            </span>

            <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    myTeamMember.contributionStatus ===
                    "completed"
                        ? "bg-green-100 text-green-700"
                        : myTeamMember.contributionStatus ===
                          "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                }`}
            >
                {myTeamMember.contributionStatus ===
                "completed"
                    ? "Completed"
                    : myTeamMember.contributionStatus ===
                      "in-progress"
                    ? "In Progress"
                    : "Not Started"}
            </span>

        </div>

    </div>

)}


                                    {/* PROJECT OWNER */}

                                    {project.user && (

                                        <div className="flex items-center gap-3 mt-5">

                                            <img
                                                src={
                                                    project.user.photoUrl ||
                                                    "https://ui-avatars.com/api/?name=Owner"
                                                }
                                                alt="Owner"
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />

                                            <div>

                                                <p className="text-xs text-gray-500">
                                                    Project Owner
                                                </p>

                                                <p className="font-semibold">
                                                    {project.user.firstName}{" "}
                                                    {project.user.lastName}
                                                </p>

                                            </div>

                                        </div>

                                    )}


                                    {/* TECH STACK */}

                                    {project.techStack?.length > 0 && (

                                        <div className="flex flex-wrap gap-2 mt-5">

                                            {project.techStack.map(
                                                (tech, index) => (

                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {tech}
                                                    </span>

                                                )
                                            )}

                                        </div>

                                    )}


                                    {/* LINKS */}

                                    <div className="flex gap-4 mt-5">

                                        {project.githubLink && (

                                            <a
                                                href={project.githubLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 font-semibold"
                                            >
                                                GitHub ↗
                                            </a>

                                        )}

                                        {project.liveLink && (

                                            <a
                                                href={project.liveLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-green-600 font-semibold"
                                            >
                                                Live Demo ↗
                                            </a>

                                        )}

                                    </div>

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
}

export default DeveloperProfile;