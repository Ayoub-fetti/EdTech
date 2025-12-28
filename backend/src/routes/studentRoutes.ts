import { Router } from 'express';
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent, enrollStudent } from '../controllers/studentController';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Create student - admin and teacher can create
router.post('/', requireRole(['admin', 'teacher']), createStudent);

// Get students - admin and teacher can view
router.get('/', requireRole(['admin', 'teacher']), getStudents);

// Get single student - admin and teacher can view
router.get('/:id', requireRole(['admin', 'teacher']), getStudent);

// Update student - admin and teacher can update
router.put('/:id', requireRole(['admin', 'teacher']), updateStudent);

// Delete student - only admin can delete
router.delete('/:id', requireRole(['admin']), deleteStudent);

// Enroll student - admin and teacher can enroll
router.post('/:id/enroll', requireRole(['admin', 'teacher']), enrollStudent);

export default router;
