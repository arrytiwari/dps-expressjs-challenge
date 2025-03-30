import { Router } from 'express';
import projectsRoutes from './projects.routes';
import reportsRoutes from './reports.routes';

const router = Router();

router.use('/projects', projectsRoutes);
router.use('/reports', reportsRoutes);

export default router;
