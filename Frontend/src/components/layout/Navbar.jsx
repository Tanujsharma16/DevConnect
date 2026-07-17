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
                </div>

                <div className="flex items-center gap-4">

                    <NavLink
                        to="/profile"
                        className="font-medium text-gray-700 hover:text-blue-600"
                    >
                        {user?.firstName}
                    </NavLink>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;