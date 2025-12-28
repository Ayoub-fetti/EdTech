import { api } from "./api";

export const sessionService = {
  createSession: (data: {
    dateSession: string;
    startTime: string;
    endTime: string;
    courseId: number;
    teacherId: number;
  }) =>
    api.post('/sessions', data),
  
  getSessions: () => api.get('/sessions'),
  
  getSession: (id: number) => api.get(`/sessions/${id}`),
  
  getSessionsByCourse: (courseId: number) => api.get(`/sessions/course/${courseId}`),
  
  deleteSession: (id: number) =>
    api.delete(`/sessions/${id}`),
};
