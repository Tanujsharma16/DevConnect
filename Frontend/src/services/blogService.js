import api from "./api";

// Get all blogs
export const getBlogs = (page = 1, limit = 10) => {
    return api.get(
        `/blogs?page=${page}&limit=${limit}`
    );
};

// Get single blog
export const getBlogById = (id) => {
    return api.get(`/blogs/${id}`);
};

// Create blog
export const createBlog = (data) => {
    return api.post("/blogs", data);
};

// Update blog
export const updateBlog = (id, data) => {
    return api.put(`/blogs/${id}`, data);
};

// Delete blog
export const deleteBlog = (id) => {
    return api.delete(`/blogs/${id}`);
};

// Like / Unlike blog
export const likeBlog = (id) => {
    return api.put(`/blogs/like/${id}`);
};

// Add comment
export const addComment = (id, data) => {
    return api.post(
        `/blogs/comment/${id}`,
        data
    );
};
// Get blogs by user
export const getBlogsByUser = (userId) => {
    return api.get(`/blogs/user/${userId}`);
};