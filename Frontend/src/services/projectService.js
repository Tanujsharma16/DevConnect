import api from "./api";

// Get all projects
export const getMyProjects = () => {
    return api.get("/projects");
};

// Create project
export const createProject = (data) => {
    return api.post("/projects", data);
};

// Get project by id
export const getProjectById = (id) => {
    return api.get(`/projects/${id}`);
};

// Update project
export const updateProject = (id, data) => {
    return api.put(`/projects/${id}`, data);
};

// Delete project
export const deleteProject = (id) => {
    return api.delete(`/projects/${id}`);
};
export const getProjectsByUser = (userId) =>
    api.get(`/projects/user/${userId}`);