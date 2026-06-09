import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api/articles"
});

export const getArticles = (q = "", sort = "refs") => {
    return API.get("", {
        params: {
            q,
            sort
        }
    });
};

export const getArticle = (title) => {
    return API.get(`/${title}`);
};

export const createArticle = (article) => {
    return API.post("", article);
};

export const deleteArticle = (title) => {
    return API.delete(`/${title}`);
};

export const getReferrers = (title) => {
    return API.get(`/${title}/referrers`);
};