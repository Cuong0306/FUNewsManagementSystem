import { apiClient } from "../api/apiClient";

const CategoryService = {
  getAllCategories: () => {
    return apiClient.get("Category");
  },                
    createCategory: (data) => {
    return apiClient.post("Category", data);
  },
  updateCategory: (id, data) => {
    return apiClient.put(`Category/${id}`, data);
  },
  deleteCategory: (id) => {
    return apiClient.delete(`Category/${id}`);
  },
  getCategoryById: (id) => {
    return apiClient.get(`Category/${id}`);
  },
};

export default CategoryService;