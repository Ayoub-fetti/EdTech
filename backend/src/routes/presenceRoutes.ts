import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import {
  createPresence,
  getPresencesByClass,
  getPresencesByStudent,
  getPresencesByPeriod
} from '../controllers/presenceController';

const router = Router();

router.post('/', authenticateToken, createPresence);
router.get('/class/:courseId', authenticateToken, getPresencesByClass);
router.get('/student/:studentId', authenticateToken, getPresencesByStudent);
router.get('/period', authenticateToken, getPresencesByPeriod);

export default router;
