import axios from "axios";

// const BASE_URL = "http://localhost:5042/api/";
const BASE_URL = "https://localhost:7238/api/";
// const BASE_URL =
//   "https://68c67f69442c663bd0273020.mockapi.io";
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const createFormDataClient = (config = {}) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      ...config.headers,
    },
  });
};

const formDataClient = createFormDataClient();
formDataClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { apiClient, formDataClient };
