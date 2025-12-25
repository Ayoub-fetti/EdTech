import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const courseService = {
  getCourses: () => api.get('/courses'),
  getCourseById: (id: number) => api.get(`/courses/${id}`),
};

export const sessionService = {
  getSessions: () => api.get('/sessions'),
  getSessionsByCourse: (courseId: number) => api.get(`/sessions/course/${courseId}`),
};
