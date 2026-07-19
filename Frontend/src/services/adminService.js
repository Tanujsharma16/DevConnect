import api from "./api";

// Get admin dashboard stats
export const getAdminStats = () => {
    return api.get("/admin/stats");
};

// Get all registered users
export const getAllUsers = () => {
    return api.get("/admin/users");
};