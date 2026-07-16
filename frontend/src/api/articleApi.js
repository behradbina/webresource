import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api"
});

// Automatically inject JWT Bearer Token inside request header pipeline
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getArticles = (q = "", sort = "refs") => {
    return API.get("/articles", { params: { q, sort } });
};

export const getArticle = (title) => {
    return API.get(`/articles/${title}`);
};

export const createArticle = (article) => {
    return API.post("/articles", article);
};

export const deleteArticle = (title) => {
    return API.delete(`/articles/${title}`);
};

export const getReferrers = (title) => {
    return API.get(`/articles/${title}/referrers`);
};

export default API;