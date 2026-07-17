import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>

    </div>
  );
}

export default MainLayout;