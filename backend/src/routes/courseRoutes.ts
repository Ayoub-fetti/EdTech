import { Router } from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse, getEnrolledStudents, getStudentCourses } from '../controllers/courseController';

const router = Router();

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/student/:studentId', getStudentCourses);
router.get('/:id/students', getEnrolledStudents);
router.get('/:id', getCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
