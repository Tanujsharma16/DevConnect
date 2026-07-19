import { BrowserRouter, Routes, Route } from "react-router-dom";

import DeveloperProfile from "./pages/Developers/DeveloperProfile";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyEmail from "./pages/Auth/VerifyEmail";

import Collaboration from "./pages/Collaboration/Collaboration";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import Projects from "./pages/Projects/Projects";
import Blogs from "./pages/Blogs/Blogs";
import Developers from "./pages/Developers/Developers";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ================= PUBLIC ROUTES ================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/verify-email"
                    element={<VerifyEmail />}
                />


                {/* ================= PROTECTED ROUTES ================= */}

                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/projects"
                        element={<Projects />}
                    />

                    <Route
                        path="/blogs"
                        element={<Blogs />}
                    />

                    <Route
                        path="/developers"
                        element={<Developers />}
                    />

                    <Route
                        path="/developers/:id"
                        element={<DeveloperProfile />}
                    />

                    <Route
                        path="/collaboration"
                        element={<Collaboration />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;