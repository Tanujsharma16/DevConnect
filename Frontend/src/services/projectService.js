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
// Get projects open for collaboration
export const getCollaborationProjects = () => {
    return api.get("/projects/collaboration");
};

// Send request to join project
export const joinProject = (projectId, data) => {
    return api.post(`/projects/${projectId}/join`, data);
};

// Accept join request
export const acceptJoinRequest = (
    projectId,
    requestId
) => {
    return api.put(
        `/projects/${projectId}/requests/${requestId}/accept`
    );
};

// Reject join request
export const rejectJoinRequest = (
    projectId,
    requestId
) => {
    return api.put(
        `/projects/${projectId}/requests/${requestId}/reject`
    );
};
// Get projects where user is a team member
export const getCollaboratingProjects = (userId) => {
    return api.get(
        `/projects/collaborating/${userId}`
    );
};
// Get logged-in user's collaboration requests
export const getMyCollaborationRequests = () => {
    return api.get("/projects/my-collaboration-requests");
};
// Update team member contribution
export const updateMemberContribution = (
    projectId,
    memberId,
    data
) => {
    return api.put(
        `/projects/${projectId}/members/${memberId}/contribution`,
        data
    );
};