// axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // Use the environment variable here
  withCredentials: true, // 全局设置 withCredentials
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
