import api from "./api";

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const getProfile = () => api.get("/auth/profile");

export const logoutUser = () => api.post("/auth/logout");

export const updateProfile = (data) => api.put("/auth/profile", data);

export const changePassword = (data) =>
  api.put("/auth/change-password", data);

export const uploadProfilePhoto = (file) => {
    const formData = new FormData();

    formData.append("photo", file);

    return api.post("/auth/upload-photo", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};