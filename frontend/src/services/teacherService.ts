import { api } from "./api";

export const teacherService = {
  createTeacher: (data: { name: string; email: string; password: string }) =>
    api.post('/teachers', data),
  
  getTeachers: () => api.get('/teachers'),
  
  getTeacher: (id: number) => api.get(`/teachers/${id}`),
  
  updateTeacher: (id: number, data: { name?: string; email?: string }) =>
    api.put(`/teachers/${id}`, data),
  
  deleteTeacher: (id: number) =>
    api.delete(`/teachers/${id}`),
};

