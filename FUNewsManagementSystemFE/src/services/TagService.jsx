import { apiClient } from "../api/apiClient";

const TagService = {
  getAllTags: () => {
    return apiClient.get("Tag");
  },
  createTag: (data) => {
    return apiClient.post("Tag", data);
  },
  updateTag: (id, data) => {
    return apiClient.put(`Tag/${id}`, data);
  },
  deleteTag: (id) => {
    return apiClient.delete(`Tag/${id}`);
  },
  getTagById: (id) => {
    return apiClient.get(`Tag/${id}`);
  },
};

export default TagService;