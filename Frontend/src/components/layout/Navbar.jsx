import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const linkClass = ({ isActive }) =>
        `px-3 py-2 rounded-lg transition ${
            isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
        }`;

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                <h1
                    className="text-2xl font-bold text-blue-600 cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                >
                    DevConnect
                </h1>

                <div className="flex gap-4">
                    <NavLink to="/dashboard" className={linkClass}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/projects" className={linkClass}>
                        Projects
                    </NavLink>

                    <NavLink to="/blogs" className={linkClass}>
                        Blogs
                    </NavLink>

                    <NavLink to="/developers" className={linkClass}>
                        Developers
                    </NavLink>
                   <NavLink to="/collaboration" className={linkClass}>
    Collaborate
</NavLink>
{user?.role === "admin" && (
    <NavLink
        to="/admin"
        className={linkClass}
    >
        Admin
    </NavLink>
)}
                </div>

                <div className="flex items-center gap-5">

    <NavLink
        to="/profile"
        className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
    >
        <img
            src={
                user?.photoUrl ||
                "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
            }
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border"
        />

        <div className="hidden md:block">
            <p className="font-semibold text-gray-800">
                {user?.firstName} {user?.lastName}
            </p>

            <p className="text-xs text-gray-500">
                View Profile
            </p>
        </div>

    </NavLink>

    <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
    >
        Logout
    </button>

</div>
            </div>
        </nav>
    );
}

export default Navbar;