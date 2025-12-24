import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import studentRoutes from './studentRoutes';
import sessionRoutes from './sessionRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/students', studentRoutes);
router.use('/sessions', sessionRoutes);

export default router;
