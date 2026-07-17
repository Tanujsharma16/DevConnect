import { useAuth } from "../../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();

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
                    <h2 className="text-gray-500">Followers</h2>
                    <p className="text-4xl font-bold mt-3">
                        {user?.followers?.length || 0}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">Following</h2>
                    <p className="text-4xl font-bold mt-3">
                        {user?.following?.length || 0}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">Projects</h2>
                    <p className="text-4xl font-bold mt-3">
                        0
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">Blogs</h2>
                    <p className="text-4xl font-bold mt-3">
                        0
                    </p>
                </div>

            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Recent Projects
                </h2>

                <div className="text-gray-500">
                    No projects yet.
                </div>
            </div>

            {/* Recent Blogs */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Recent Blogs
                </h2>

                <div className="text-gray-500">
                    No blogs yet.
                </div>
            </div>

        </div>
    );
}

export default Dashboard;