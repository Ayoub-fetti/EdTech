import { Router } from 'express';
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent, enrollStudent } from '../controllers/studentController';

const router = Router();

router.post('/', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.post('/:id/enroll', enrollStudent);

export default router;
