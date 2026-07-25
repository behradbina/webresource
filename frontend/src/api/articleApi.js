import axios from "axios";

const API_BASE_URL = import.meta.env.PROD 
    ? '/api'  // In production, use relative path (nginx proxy)
    : 'http://localhost:8080/api';  // In development

const API = axios.create({
    baseURL: API_BASE_URL
});

// Rest of your code remains the same...

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

export const getArticles = (q = "", sort = "refs", config = {}) => {
    return API.get("/articles", { ...config, params: { q, sort } });
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