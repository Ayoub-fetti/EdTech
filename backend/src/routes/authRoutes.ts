import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/login', AuthController.login);
router.post('/logout', authenticateToken, AuthController.logout);

export default router;
