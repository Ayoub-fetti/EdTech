import { api } from "./api";

export const courseService = {
  createCourse: (data: { title: string; description?: string; teacherId: number }) =>
    api.post('/courses', data),
  
  getCourses: () => api.get('/courses'),
  
  getCourseById: (id: number) => api.get(`/courses/${id}`),
  
  updateCourse: (id: number, data: { title?: string; description?: string; teacherId?: number }) =>
    api.put(`/courses/${id}`, data),
  
  deleteCourse: (id: number) =>
    api.delete(`/courses/${id}`),
};
