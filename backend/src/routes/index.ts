import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import studentRoutes from './studentRoutes';
import teacherRoutes from './teacherRoutes';
import sessionRoutes from './sessionRoutes';
import presenceRoutes from './presenceRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/sessions', sessionRoutes);
router.use('/presences', presenceRoutes);

export default router;
