import { courseService } from '../courseService';
import { sessionService } from '../sessionService';
import { presenceService } from '../presenceService';
import { studentService } from '../studentService';

export const teacherService = {
  getCourses: courseService.getCourses,
  getCourseById: courseService.getCourseById,
  updateCourse: courseService.updateCourse,
  
  ...sessionService,
  ...presenceService,
  
  getStudents: studentService.getStudents,
  getStudent: studentService.getStudent,
  enrollStudent: studentService.enrollStudent,
};
