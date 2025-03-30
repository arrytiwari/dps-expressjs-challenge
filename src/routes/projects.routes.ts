import { Router } from 'express';
import {
	getAllProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
} from '../controllers/projects.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate, projectSchema } from '../utils/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Project routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', validate(projectSchema), createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
