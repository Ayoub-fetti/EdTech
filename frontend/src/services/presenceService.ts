import { api } from "./api";

export const presenceService = {
  createPresence: (data: {
    sessionId: number;
    studentId: number;
    status: 'present' | 'absent' | 'late' | 'excused';
  }) => api.post('/presences', data),
  
  getPresencesByClass: (courseId: number) =>
    api.get(`/presences/class/${courseId}`),
  
  getPresencesByStudent: (studentId: number) =>
    api.get(`/presences/student/${studentId}`),
  
  getPresencesByPeriod: (startDate: string, endDate: string) =>
    api.get('/presences/period', { params: { startDate, endDate } }),
};