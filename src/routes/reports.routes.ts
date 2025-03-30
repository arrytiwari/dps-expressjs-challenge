import { Router } from 'express';
import {
	getAllReports,
	getReportById,
	createReport,
	updateReport,
	deleteReport,
	getReportsWithRepeatedWords,
} from '../controllers/reports.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { reportSchema, validate } from '../utils/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Report routes
router.get('/', getAllReports);
router.get('/repeated-words', getReportsWithRepeatedWords);
router.get('/:id', getReportById);
router.post('/', validate(reportSchema), createReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

export default router;
