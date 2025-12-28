import { Router } from 'express';
import { createTeacher, getTeachers, getTeacher, updateTeacher, deleteTeacher } from '../controllers/teacherController';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = Router();

// All teacher routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(['admin']));

router.post('/', createTeacher);
router.get('/', getTeachers);
router.get('/:id', getTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;

