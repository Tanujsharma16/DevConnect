import { useEffect, useState } from "react";
import {
    getAdminStats,
    getAllUsers,
} from "../../services/adminService";

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            setError("");

            const [statsRes, usersRes] =
                await Promise.all([
                    getAdminStats(),
                    getAllUsers(),
                ]);

            setStats(
                statsRes.data.stats || {
                    totalUsers: 0,
                    verifiedUsers: 0,
                    unverifiedUsers: 0,
                }
            );

            setUsers(usersRes.data.users || []);

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Unable to load admin dashboard"
            );

        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500">
                Loading Admin Dashboard...
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* HEADER */}

            <div className="bg-white rounded-xl shadow p-6">
                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage and monitor DevConnect users.
                </p>
            </div>


            {/* ERROR */}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl">
                    {error}
                </div>
            )}


            {/* STATS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">
                        Total Users
                    </h2>

                    <p className="text-4xl font-bold mt-3">
                        {stats.totalUsers}
                    </p>
                </div>


                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">
                        Verified Users
                    </h2>

                    <p className="text-4xl font-bold mt-3 text-green-600">
                        {stats.verifiedUsers}
                    </p>
                </div>


                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">
                        Unverified Users
                    </h2>

                    <p className="text-4xl font-bold mt-3 text-orange-600">
                        {stats.unverifiedUsers}
                    </p>
                </div>

            </div>


            {/* USERS TABLE */}

            <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

                <h2 className="text-2xl font-bold mb-5">
                    Registered Users
                </h2>

                {users.length === 0 ? (

                    <p className="text-gray-500">
                        No registered users found.
                    </p>

                ) : (

                    <table className="w-full min-w-[800px]">

                        <thead>
                            <tr className="border-b text-left">

                                <th className="py-3 px-4">
                                    User
                                </th>

                                <th className="py-3 px-4">
                                    Email
                                </th>

                                <th className="py-3 px-4">
                                    Role
                                </th>

                                <th className="py-3 px-4">
                                    Email Status
                                </th>

                                <th className="py-3 px-4">
                                    Registered
                                </th>

                            </tr>
                        </thead>


                        <tbody>

                            {users.map((user) => (

                                <tr
                                    key={user._id}
                                    className="border-b"
                                >

                                    {/* USER */}

                                    <td className="py-4 px-4">

                                        <div className="flex items-center gap-3">

                                            <img
                                                src={
                                                    user.photoUrl ||
                                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                                }
                                                alt="User"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />

                                            <span className="font-semibold">
                                                {user.firstName}{" "}
                                                {user.lastName}
                                            </span>

                                        </div>

                                    </td>


                                    {/* EMAIL */}

                                    <td className="py-4 px-4 text-gray-600">
                                        {user.email}
                                    </td>


                                    {/* ROLE */}

                                    <td className="py-4 px-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                user.role === "admin"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {user.role || "user"}
                                        </span>

                                    </td>


                                    {/* EMAIL STATUS */}

                                    <td className="py-4 px-4">

                                        {user.isEmailVerified ? (

                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                Verified
                                            </span>

                                        ) : (

                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                Unverified
                                            </span>

                                        )}

                                    </td>


                                    {/* REGISTERED DATE */}

                                    <td className="py-4 px-4 text-gray-500">

                                        {user.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString()
                                            : "N/A"}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}

export default AdminDashboard;