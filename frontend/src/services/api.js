import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auth token interceptor removed as authentication is no longer mandatory

export default api;
