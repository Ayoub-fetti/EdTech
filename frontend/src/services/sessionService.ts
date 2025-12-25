import { api } from "./api";

export const sessionService = {
  getSessions: () => api.get('/sessions'),
  getSessionsByCourse: (courseId: number) => api.get(`/sessions/course/${courseId}`),
};
