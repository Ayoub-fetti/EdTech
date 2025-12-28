import { Router } from 'express';
import { createSession, getSessions, getSession, getSessionsByCourse, deleteSession } from '../controllers/sessionController';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = Router();

// Create session requires authentication and teacher role
router.post('/', authenticateToken, requireRole(['teacher', 'admin']), createSession);

// Other routes
router.get('/', getSessions);
router.get('/:id', getSession);
router.get('/course/:courseId', getSessionsByCourse);
router.delete('/:id', deleteSession);

export default router;
