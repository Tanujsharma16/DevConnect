import { useEffect, useState } from "react";
import {
    getCollaborationProjects,
    joinProject,
    getMyCollaborationRequests,
    getCollaboratingProjects,
    updateMemberContribution,
} from "../../services/projectService";
import { useAuth } from "../../context/AuthContext";

function Collaboration() {
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myCollaborations, setMyCollaborations] = useState([]);
const [contributions, setContributions] = useState({});
const [updatingContribution, setUpdatingContribution] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState({});
    const [messages, setMessages] = useState({});
    const [sendingRequest, setSendingRequest] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch collaboration projects + my requests
  const fetchData = async () => {
    try {
        setLoading(true);

        const [projectsRes, requestsRes, collaborationsRes] =
            await Promise.all([
                getCollaborationProjects(),
                getMyCollaborationRequests(),
                getCollaboratingProjects(user._id),
            ]);

        setProjects(
            projectsRes.data.projects || []
        );

        setMyRequests(
            requestsRes.data.requests || []
        );

        setMyCollaborations(
            collaborationsRes.data.projects || []
        );

    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};

    const handleRoleChange = (projectId, role) => {
        setSelectedRoles((prev) => ({
            ...prev,
            [projectId]: role,
        }));
    };

    const handleMessageChange = (
        projectId,
        message
    ) => {
        setMessages((prev) => ({
            ...prev,
            [projectId]: message,
        }));
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

        const data =
            contributions[member._id] || {};

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

        await fetchData();

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
    const handleJoinRequest = async (
        projectId
    ) => {
        const role =
            selectedRoles[projectId];

        if (!role) {
            alert(
                "Please select a role first."
            );
            return;
        }

        try {
            setSendingRequest(projectId);

            await joinProject(projectId, {
                role,
                message:
                    messages[projectId] || "",
            });

            alert(
                "Join request sent successfully!"
            );

            setSelectedRoles((prev) => ({
                ...prev,
                [projectId]: "",
            }));

            setMessages((prev) => ({
                ...prev,
                [projectId]: "",
            }));

            // Refresh projects and requests
            await fetchData();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                    "Unable to send join request"
            );

        } finally {
            setSendingRequest(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-xl font-semibold">
                    Loading collaboration projects...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-10">

            {/* HEADER */}

            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Find Projects to Collaborate
                </h1>

                <p className="text-gray-500 mt-2">
                    Discover projects, find the
                    right role and join developers
                    to build something together.
                </p>
            </div>


            {/* MY COLLABORATION REQUESTS */}

            <div>

                <div className="flex items-center justify-between mb-5">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            My Collaboration Requests
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Track the status of your
                            project join requests.
                        </p>
                    </div>

                    <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                        {myRequests.length} Requests
                    </span>

                </div>


                {myRequests.length === 0 ? (

                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 text-center">

                        <p className="text-gray-500">
                            You haven't sent any
                            collaboration requests yet.
                        </p>

                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 gap-5">

                        {myRequests.map(
                            (request) => {

                                const statusClasses = {
                                    pending:
                                        "bg-yellow-100 text-yellow-700",
                                    accepted:
                                        "bg-green-100 text-green-700",
                                    rejected:
                                        "bg-red-100 text-red-700",
                                };

                                return (

                                    <div
                                        key={
                                            request.requestId
                                        }
                                        className="bg-white rounded-2xl shadow border border-gray-100 p-6"
                                    >

                                        <div className="flex justify-between items-start gap-4">

                                            <div>

                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {
                                                        request.projectTitle
                                                    }
                                                </h3>

                                                <p className="text-gray-500 text-sm mt-2">
                                                    {
                                                        request.projectDescription
                                                    }
                                                </p>

                                            </div>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                                    statusClasses[
                                                        request
                                                            .status
                                                    ] ||
                                                    "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {
                                                    request.status
                                                }
                                            </span>

                                        </div>


                                        {/* APPLIED ROLE */}

                                        <div className="mt-5">

                                            <p className="text-xs text-gray-500">
                                                Applied Role
                                            </p>

                                            <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                {
                                                    request.role
                                                }
                                            </span>

                                        </div>


                                        {/* PROJECT OWNER */}

                                        {request.owner && (

                                            <div className="flex items-center gap-3 mt-5">

                                                <img
                                                    src={
                                                        request
                                                            .owner
                                                            .photoUrl ||
                                                        "https://ui-avatars.com/api/?name=Owner"
                                                    }
                                                    alt="Owner"
                                                    className="w-10 h-10 rounded-full object-cover border"
                                                />

                                                <div>

                                                    <p className="text-xs text-gray-500">
                                                        Project
                                                        Owner
                                                    </p>

                                                    <p className="font-semibold text-gray-800">
                                                        {
                                                            request
                                                                .owner
                                                                .firstName
                                                        }{" "}
                                                        {
                                                            request
                                                                .owner
                                                                .lastName
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )}


                                        {/* REQUEST MESSAGE */}

                                        {request.message && (

                                            <div className="mt-5 bg-gray-50 rounded-xl p-4">

                                                <p className="text-xs text-gray-500 mb-1">
                                                    Your
                                                    Message
                                                </p>

                                                <p className="text-sm text-gray-700">
                                                    {
                                                        request.message
                                                    }
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                );
                            }
                        )}

                    </div>

                )}

            </div>

                {/* MY COLLABORATIONS */}

<div>
    <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900">
            My Collaborations
        </h2>

        <p className="text-gray-500 mt-1">
            Manage your contributions to projects you have joined.
        </p>
    </div>

    {myCollaborations.length === 0 ? (

        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 text-center">
            <p className="text-gray-500">
                You are not collaborating on any projects yet.
            </p>
        </div>

    ) : (

        <div className="grid md:grid-cols-2 gap-5">

            {myCollaborations.map((project) => {

                const myMember = project.teamMembers?.find(
                    (member) =>
                        (
                            member.user?._id ||
                            member.user
                        )?.toString() ===
                        user?._id?.toString()
                );

                if (!myMember) return null;

                return (
                    <div
                        key={project._id}
                        className="bg-white rounded-2xl shadow border border-gray-100 p-6"
                    >

                        {/* PROJECT INFO */}

                        <h3 className="text-xl font-bold text-gray-900">
                            {project.title}
                        </h3>

                        <p className="text-gray-600 mt-2">
                            {project.description}
                        </p>


                        {/* MY ROLE */}

                        <div className="mt-4">
                            <p className="text-xs text-gray-500">
                                Your Role
                            </p>

                            <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {myMember.role}
                            </span>
                        </div>


                        {/* CONTRIBUTION */}

                        <div className="mt-5">
                            <label className="block text-sm font-semibold mb-2">
                                Your Contribution
                            </label>

                            <textarea
                                rows="3"
                                placeholder="Describe what you contributed to this project..."
                                value={
                                    contributions[myMember._id]
                                        ?.contribution ??
                                    myMember.contribution ??
                                    ""
                                }
                                onChange={(e) =>
                                    handleContributionChange(
                                        myMember._id,
                                        "contribution",
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />
                        </div>


                        {/* STATUS */}

                        <div className="mt-4">
                            <label className="block text-sm font-semibold mb-2">
                                Contribution Status
                            </label>

                            <select
                                value={
                                    contributions[myMember._id]
                                        ?.contributionStatus ??
                                    myMember.contributionStatus ??
                                    "not-started"
                                }
                                onChange={(e) =>
                                    handleContributionChange(
                                        myMember._id,
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


                        {/* UPDATE BUTTON */}

                        <button
                            onClick={() =>
                                handleUpdateContribution(
                                    project._id,
                                    myMember
                                )
                            }
                            disabled={
                                updatingContribution ===
                                myMember._id
                            }
                            className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                        >
                            {updatingContribution ===
                            myMember._id
                                ? "Updating..."
                                : "Update My Contribution"}
                        </button>

                    </div>
                );
            })}

        </div>

    )}

</div>
            {/* AVAILABLE PROJECTS HEADER */}

            <div className="pt-4 border-t">

                <h2 className="text-2xl font-bold text-gray-900">
                    Available Projects
                </h2>

                <p className="text-gray-500 mt-1">
                    Explore projects currently looking
                    for team members.
                </p>

            </div>


            {/* EMPTY STATE */}

            {projects.length === 0 ? (

                <div className="bg-white rounded-2xl shadow p-12 text-center">

                    <div className="text-5xl mb-4">
                        🚀
                    </div>

                    <h2 className="text-2xl font-bold">
                        No Collaboration Projects
                    </h2>

                    <p className="text-gray-500 mt-2">
                        There are currently no projects
                        looking for collaborators.
                    </p>

                </div>

            ) : (

                <div className="grid lg:grid-cols-2 gap-6">

                    {projects.map((project) => {

                        const ownerId =
                            project.user?._id ||
                            project.user;

                        const isOwner =
                            ownerId?.toString() ===
                            user?._id?.toString();

                        const currentTeamSize =
                            (project.teamMembers
                                ?.length || 0) + 1;

                        const maxTeamSize =
                            project.maxTeamSize || 1;

                        const availableSpots =
                            Math.max(
                                maxTeamSize -
                                    currentTeamSize,
                                0
                            );

                        const teamFull =
                            availableSpots === 0;

                        const existingRequest =
                            project.joinRequests?.find(
                                (request) =>
                                    (
                                        request.user
                                            ?._id ||
                                        request.user
                                    )?.toString() ===
                                        user?._id?.toString() &&
                                    request.status ===
                                        "pending"
                            );

                        const alreadyMember =
                            project.teamMembers?.some(
                                (member) =>
                                    (
                                        member.user
                                            ?._id ||
                                        member.user
                                    )?.toString() ===
                                    user?._id?.toString()
                            );

                        return (

                            <div
                                key={project._id}
                                className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden"
                            >

                                <div className="p-6">


                                    {/* CARD HEADER */}

                                    <div className="flex justify-between items-start gap-4">

                                        <div>

                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {
                                                    project.title
                                                }
                                            </h2>

                                            <div className="flex items-center gap-3 mt-3">

                                                <img
                                                    src={
                                                        project
                                                            .user
                                                            ?.photoUrl ||
                                                        "https://ui-avatars.com/api/?name=Developer"
                                                    }
                                                    alt="Owner"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />

                                                <div>

                                                    <p className="text-sm text-gray-500">
                                                        Project
                                                        Owner
                                                    </p>

                                                    <p className="font-semibold">
                                                        {
                                                            project
                                                                .user
                                                                ?.firstName
                                                        }{" "}
                                                        {
                                                            project
                                                                .user
                                                                ?.lastName
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            Open
                                        </span>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <p className="text-gray-600 mt-5 leading-relaxed">
                                        {
                                            project.description
                                        }
                                    </p>


                                    {/* TECH STACK */}

                                    {project.techStack
                                        ?.length > 0 && (

                                        <div className="flex flex-wrap gap-2 mt-5">

                                            {project.techStack.map(
                                                (
                                                    tech,
                                                    index
                                                ) => (

                                                    <span
                                                        key={
                                                            index
                                                        }
                                                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {
                                                            tech
                                                        }
                                                    </span>

                                                )
                                            )}

                                        </div>

                                    )}


                                    {/* TEAM INFORMATION */}

                                    <div className="grid grid-cols-2 gap-4 mt-6">

                                        <div className="bg-gray-50 rounded-xl p-4">

                                            <p className="text-sm text-gray-500">
                                                Team Members
                                            </p>

                                            <p className="text-xl font-bold mt-1">
                                                {
                                                    currentTeamSize
                                                }{" "}
                                                /{" "}
                                                {
                                                    maxTeamSize
                                                }
                                            </p>

                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4">

                                            <p className="text-sm text-gray-500">
                                                Spots Available
                                            </p>

                                            <p className="text-xl font-bold mt-1">
                                                {
                                                    availableSpots
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* REQUIRED ROLES */}

                                    {project.requiredRoles
                                        ?.length > 0 && (

                                        <div className="mt-6">

                                            <h3 className="font-bold text-lg">
                                                Looking For
                                            </h3>

                                            <div className="space-y-3 mt-3">

                                                {project.requiredRoles.map(
                                                    (
                                                        role,
                                                        index
                                                    ) => {

                                                        const acceptedForRole =
                                                            project.teamMembers?.filter(
                                                                (
                                                                    member
                                                                ) =>
                                                                    member.role ===
                                                                    role.role
                                                            )
                                                                .length ||
                                                            0;

                                                        const remaining =
                                                            Math.max(
                                                                role.openings -
                                                                    acceptedForRole,
                                                                0
                                                            );

                                                        return (

                                                            <div
                                                                key={
                                                                    role._id ||
                                                                    index
                                                                }
                                                                className="border rounded-xl p-4"
                                                            >

                                                                <div className="flex justify-between gap-3">

                                                                    <span className="font-semibold">
                                                                        {
                                                                            role.role
                                                                        }
                                                                    </span>

                                                                    <span
                                                                        className={`text-sm font-semibold ${
                                                                            remaining ===
                                                                            0
                                                                                ? "text-red-600"
                                                                                : "text-green-600"
                                                                        }`}
                                                                    >
                                                                        {remaining ===
                                                                        0
                                                                            ? "Role Full"
                                                                            : `${remaining} ${
                                                                                  remaining ===
                                                                                  1
                                                                                      ? "opening"
                                                                                      : "openings"
                                                                              } remaining`}
                                                                    </span>

                                                                </div>


                                                                {role
                                                                    .skills
                                                                    ?.length >
                                                                    0 && (

                                                                    <div className="flex flex-wrap gap-2 mt-3">

                                                                        {role.skills.map(
                                                                            (
                                                                                skill,
                                                                                skillIndex
                                                                            ) => (

                                                                                <span
                                                                                    key={
                                                                                        skillIndex
                                                                                    }
                                                                                    className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs"
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

                                                        );
                                                    }
                                                )}

                                            </div>

                                        </div>

                                    )}


                                    {/* JOIN SECTION */}

                                    <div className="mt-6 pt-6 border-t">

                                        {isOwner ? (

                                            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-center font-semibold">
                                                This is your project
                                            </div>

                                        ) : alreadyMember ? (

                                            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-semibold">
                                                You are a member
                                                of this project
                                            </div>

                                        ) : existingRequest ? (

                                            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl text-center font-semibold">
                                                Join request
                                                pending
                                            </div>

                                        ) : teamFull ? (

                                            <div className="bg-gray-100 text-gray-600 p-4 rounded-xl text-center font-semibold">
                                                Team is full
                                            </div>

                                        ) : (

                                            <div className="space-y-4">


                                                {/* ROLE SELECT */}

                                                <div>

                                                    <label className="block font-semibold mb-2">
                                                        Select Role
                                                    </label>

                                                    <select
                                                        value={
                                                            selectedRoles[
                                                                project
                                                                    ._id
                                                            ] ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleRoleChange(
                                                                project._id,
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="w-full border rounded-lg px-4 py-3 bg-white"
                                                    >

                                                        <option value="">
                                                            Select
                                                            a role
                                                        </option>

                                                        {project.requiredRoles?.map(
                                                            (
                                                                role,
                                                                index
                                                            ) => {

                                                                const acceptedForRole =
                                                                    project.teamMembers?.filter(
                                                                        (
                                                                            member
                                                                        ) =>
                                                                            member.role ===
                                                                            role.role
                                                                    )
                                                                        .length ||
                                                                    0;

                                                                const remaining =
                                                                    Math.max(
                                                                        role.openings -
                                                                            acceptedForRole,
                                                                        0
                                                                    );

                                                                return (

                                                                    <option
                                                                        key={
                                                                            role._id ||
                                                                            index
                                                                        }
                                                                        value={
                                                                            role.role
                                                                        }
                                                                        disabled={
                                                                            remaining ===
                                                                            0
                                                                        }
                                                                    >
                                                                        {
                                                                            role.role
                                                                        }
                                                                        {remaining ===
                                                                        0
                                                                            ? " (Full)"
                                                                            : ` (${remaining} remaining)`}
                                                                    </option>

                                                                );
                                                            }
                                                        )}

                                                    </select>

                                                </div>


                                                {/* MESSAGE */}

                                                <div>

                                                    <label className="block font-semibold mb-2">
                                                        Message to
                                                        Project Owner
                                                    </label>

                                                    <textarea
                                                        rows="3"
                                                        maxLength="500"
                                                        placeholder="Tell the project owner why you would like to join..."
                                                        value={
                                                            messages[
                                                                project
                                                                    ._id
                                                            ] ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleMessageChange(
                                                                project._id,
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="w-full border rounded-lg px-4 py-3"
                                                    />

                                                </div>


                                                {/* JOIN BUTTON */}

                                                <button
                                                    onClick={() =>
                                                        handleJoinRequest(
                                                            project._id
                                                        )
                                                    }
                                                    disabled={
                                                        sendingRequest ===
                                                        project._id
                                                    }
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                                                >
                                                    {sendingRequest ===
                                                    project._id
                                                        ? "Sending Request..."
                                                        : "Request to Join"}
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>

            )}

        </div>
    );
}

export default Collaboration;