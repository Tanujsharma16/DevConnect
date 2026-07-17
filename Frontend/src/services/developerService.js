import api from "./api";

export const getDevelopers = (params = {}) => {
    return api.get("/developers", {
        params,
    });
};

export const getDeveloperById = (id) => {
    return api.get("/developers/" + id);
};