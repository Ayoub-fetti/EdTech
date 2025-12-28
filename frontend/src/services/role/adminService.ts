import { courseService } from '../courseService';
import { studentService } from '../studentService';
import { sessionService } from '../sessionService';
import { presenceService } from '../presenceService';

export const adminService = {
  ...courseService,
  ...studentService,
  ...sessionService,
  ...presenceService,
};
