import { api } from './api';

export const studentService = {
  createStudent: (data: { email: string; password: string; name: string }) =>
    api.post('/students', data),
  
  getStudents: () =>
    api.get('/students'),
  
  getStudent: (id: number) =>
    api.get(`/students/${id}`),
  
  updateStudent: (id: number, data: { name?: string; email?: string }) =>
    api.put(`/students/${id}`, data),
  
  deleteStudent: (id: number) =>
    api.delete(`/students/${id}`),
  
  enrollStudent: (id: number, courseId: number) =>
    api.post(`/students/${id}/enroll`, { courseId }),
};
