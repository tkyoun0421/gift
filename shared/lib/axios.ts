import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "" : "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  config => {
    console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error("요청 에러:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`API 응답: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error("응답 에러:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
