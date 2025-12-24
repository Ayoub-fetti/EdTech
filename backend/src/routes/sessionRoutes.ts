import { Router } from 'express';
import { createSession, getSessions, getSession, getSessionsByCourse, deleteSession } from '../controllers/sessionController';

const router = Router();

router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSession);
router.get('/course/:courseId', getSessionsByCourse);
router.delete('/:id', deleteSession);

export default router;
