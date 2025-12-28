import { api } from './api';

export const presenceService = {
  createPresence: (data: {
    sessionId: number;
    studentId: number;
    status: 'present' | 'absent' | 'late';
  }) =>
    api.post('/presences', data),
  
  getPresencesByClass: (courseId: number) =>
    api.get(`/presences/class/${courseId}`),
  
  getPresencesByStudent: (studentId: number) =>
    api.get(`/presences/student/${studentId}`),
  
  getPresencesByPeriod: (params: { startDate?: string; endDate?: string; courseId?: number; studentId?: number }) =>
    api.get('/presences/period', { params }),
};
