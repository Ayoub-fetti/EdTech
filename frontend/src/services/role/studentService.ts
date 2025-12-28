import { courseService } from '../courseService';
import { sessionService } from '../sessionService';
import { presenceService } from '../presenceService';

export const studentService = {
  getCourses: courseService.getCourses,
  getCourseById: courseService.getCourseById,
  
  
  getSessions: sessionService.getSessions,
  getSessionsByCourse: sessionService.getSessionsByCourse,
  
  
  getMyPresences: (studentId: number) => presenceService.getPresencesByStudent(studentId),
};
