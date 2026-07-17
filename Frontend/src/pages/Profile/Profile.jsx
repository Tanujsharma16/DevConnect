import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EditProfileModal from "../../components/profile/EditProfileModal";

function Profile() {
    const { user, fetchUser } = useAuth();
    const [showModal, setShowModal] = useState(false);

    if (!user) {
        return (
            <div className="text-center mt-10 text-xl">
                Loading...
            </div>
        );
    }

    return (
        <>
            <div className="max-w-5xl mx-auto">

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                    <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                    <div className="px-8 pb-8">

                        <div className="-mt-16 flex flex-col md:flex-row md:items-end md:justify-between">

                            <div className="flex items-end gap-6">

                                <img
                                    src={user.photoUrl}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                                />

                                <div className="pb-3">

                                    <h1 className="text-3xl font-bold">
                                        {user.firstName} {user.lastName}
                                    </h1>

                                    <p className="text-gray-500">
                                        {user.email}
                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={() => setShowModal(true)}
                                className="mt-6 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                            >
                                Edit Profile
                            </button>

                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mt-10">

                            <div>

                                <h2 className="text-xl font-semibold mb-3">
                                    About
                                </h2>

                                <p className="text-gray-600">
                                    {user.about || "No description added."}
                                </p>

                                <div className="mt-8">

                                    <h2 className="text-xl font-semibold mb-3">
                                        Skills
                                    </h2>

                                    <div className="flex flex-wrap gap-2">

                                        {user.skills?.length ? (
                                            user.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p>No skills added.</p>
                                        )}

                                    </div>

                                </div>

                            </div>

                            <div>

                                <h2 className="text-xl font-semibold mb-4">
                                    Details
                                </h2>

                                <div className="space-y-3">

                                    <p><strong>Age:</strong> {user.age || "-"}</p>

                                    <p><strong>Gender:</strong> {user.gender || "-"}</p>

                                    <p><strong>GitHub:</strong> {user.githubUsername || "-"}</p>

                                    <p><strong>LinkedIn:</strong> {user.linkedin || "-"}</p>

                                    <p><strong>Portfolio:</strong> {user.portfolio || "-"}</p>

                                </div>
                                  {user.githubData && (
    <div className="mt-10 border rounded-xl p-6 bg-gray-50">

        <h2 className="text-2xl font-bold mb-5">
            GitHub Profile
        </h2>

        <div className="flex items-center gap-5">

            <img
                src={user.githubData.avatarUrl}
                alt="GitHub"
                className="w-24 h-24 rounded-full border"
            />

            <div>

                <h3 className="text-xl font-semibold">
                    {user.githubData.name || user.githubUsername}
                </h3>

                <p className="text-gray-600 mt-2">
                    {user.githubData.bio || "No bio available"}
                </p>

                <div className="flex gap-6 mt-4">

                    <span>
                        <strong>Repos:</strong>{" "}
                        {user.githubData.publicRepos}
                    </span>

                    <span>
                        <strong>Followers:</strong>{" "}
                        {user.githubData.followers}
                    </span>

                    <span>
                        <strong>Following:</strong>{" "}
                        {user.githubData.following}
                    </span>

                </div>

                <a
                    href={user.githubData.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-5 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                >
                    View GitHub Profile
                </a>

            </div>

        </div>

    </div>
)}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {showModal && (
                <EditProfileModal
                    user={user}
                    fetchUser={fetchUser}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}

export default Profile;