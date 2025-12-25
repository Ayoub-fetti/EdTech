import { api } from "./api";


export const courseService = {
  getCourses: () => api.get('/courses'),
  getCourseById: (id: number) => api.get(`/courses/${id}`),
};