import { Request, Response } from 'express';
import dbService from '../db/db.service';
import {
	asyncHandler,
	NotFoundError,
	BadRequestError,
} from '../utils/errorHandler';

export const getAllReports = asyncHandler(
	async (req: Request, res: Response) => {
		const reports = await dbService.query('SELECT * FROM reports');
		res.status(200).json(reports);
	},
);

export const getReportById = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const report = await dbService.get(
			'SELECT * FROM reports WHERE id = ?',
			[id],
		);

		if (!report) {
			throw new NotFoundError('Report not found');
		}

		res.status(200).json(report);
	},
);

export const createReport = asyncHandler(
	async (req: Request, res: Response) => {
		const { text, project_id } = req.body;

		if (!text || !project_id) {
			throw new BadRequestError('Text and project_id are required');
		}

		// Check if project exists
		const existingProject = await dbService.get(
			'SELECT * FROM projects WHERE id = ?',
			[project_id],
		);

		if (!existingProject) {
			throw new NotFoundError('Project not found');
		}

		const result = await dbService.run(
			'INSERT INTO reports (text, project_id) VALUES (?, ?)',
			[text, project_id],
		);

		// Get the created report
		const newReport = await dbService.get(
			'SELECT * FROM reports WHERE id = ?',
			[result.lastID],
		);

		res.status(201).json(newReport);
	},
);

export const updateReport = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { text, project_id } = req.body;

		if (!text && !project_id) {
			throw new BadRequestError(
				'At least one field (text or project_id) is required',
			);
		}

		// Check if report exists
		const existingReport = await dbService.get(
			'SELECT * FROM reports WHERE id = ?',
			[id],
		);

		if (!existingReport) {
			throw new NotFoundError('Report not found');
		}

		// If project_id is being updated, check if the new project exists
		if (project_id) {
			const existingProject = await dbService.get(
				'SELECT * FROM projects WHERE id = ?',
				[project_id],
			);

			if (!existingProject) {
				throw new NotFoundError('Project not found');
			}
		}

		// Build update query
		const updates = [];
		const updateValues = [];

		if (text) {
			updates.push('text = ?');
			updateValues.push(text);
		}

		if (project_id) {
			updates.push('project_id = ?');
			updateValues.push(project_id);
		}

		await dbService.run(
			`UPDATE reports SET ${updates.join(', ')} WHERE id = ?`,
			[...updateValues, id],
		);

		// Get the updated report
		const updatedReport = await dbService.get(
			'SELECT * FROM reports WHERE id = ?',
			[id],
		);

		res.status(200).json(updatedReport);
	},
);

export const deleteReport = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		// Check if report exists
		const existingReport = await dbService.get(
			'SELECT * FROM reports WHERE id = ?',
			[id],
		);

		if (!existingReport) {
			throw new NotFoundError('Report not found');
		}

		await dbService.run('DELETE FROM reports WHERE id = ?', [id]);

		res.status(200).json({ message: 'Report deleted successfully' });
	},
);

// Special endpoint: Get reports where the same word appears at least three times
export const getReportsWithRepeatedWords = asyncHandler(
	async (req: Request, res: Response) => {
		// Get all reports
		const reports = await dbService.query('SELECT * FROM reports');

		// Filter reports with repeated words
		const reportsWithRepeatedWords = reports.filter(
			(report: { text: string }) => {
				const text = report.text.toLowerCase();

				// Remove punctuation and split into words
				const words = text
					.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
					.split(/\s+/);

				// Count occurrences of each word
				const wordCount = words.reduce(
					(acc: Record<string, number>, word: string) => {
						if (word) {
							acc[word] = (acc[word] || 0) + 1;
						}
						return acc;
					},
					{},
				);

				// Check if any word appears at least three times
				return Object.values(wordCount).some((count) => count >= 3);
			},
		);

		res.status(200).json(reportsWithRepeatedWords);
	},
);
