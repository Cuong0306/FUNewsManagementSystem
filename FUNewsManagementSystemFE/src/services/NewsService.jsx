import { apiClient } from "../api/apiClient";

const NewsService = {
  getAllNews: () => {
    return apiClient.get("NewsArticle");   
    },
    createNews: (data) => {
    return apiClient.post("NewsArticle", data);
  },    
    updateNews: (id, data) => {
    return apiClient.put(`NewsArticle/${id}`, data);
  },
    deleteNews: (id) => {
    return apiClient.delete(`NewsArticle/${id}`);
  },
    getNewsById: (id) => {
    return apiClient.get(`NewsArticle/${id}`);
  },
};

export default NewsService;