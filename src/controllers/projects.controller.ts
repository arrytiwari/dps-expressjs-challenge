import { Request, Response } from 'express';
import dbService from '../db/db.service';
import { Project } from '../models/projects.model';
import {
	asyncHandler,
	NotFoundError,
	BadRequestError,
} from '../utils/errorHandler';

export const getAllProjects = asyncHandler(
	async (req: Request, res: Response) => {
		const projects = await dbService.query('SELECT * FROM projects');
		res.status(200).json(projects);
	},
);

export const getProjectById = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const project = await dbService.get(
			'SELECT * FROM projects WHERE id = ?',
			[id],
		);

		if (!project) {
			throw new NotFoundError('Project not found');
		}

		// Get associated reports for this project
		const reports = await dbService.query(
			'SELECT * FROM reports WHERE project_id = ?',
			[id],
		);

		res.status(200).json({
			...project,
			reports,
		});
	},
);

export const createProject = asyncHandler(
	async (req: Request, res: Response) => {
		const { name, description } = req.body;

		if (!name || !description) {
			throw new BadRequestError('Name and description are required');
		}

		const result = await dbService.run(
			'INSERT INTO projects (name, description) VALUES (?, ?)',
			[name, description],
		);

		// Get the created project
		const newProject = await dbService.get(
			'SELECT * FROM projects WHERE id = ?',
			[result.lastID],
		);

		res.status(201).json(newProject);
	},
);

export const updateProject = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { name, description } = req.body;

		if (!name && !description) {
			throw new BadRequestError(
				'At least one field (name or description) is required',
			);
		}

		// Check if project exists
		const existingProject = await dbService.get(
			'SELECT * FROM projects WHERE id = ?',
			[id],
		);

		if (!existingProject) {
			throw new NotFoundError('Project not found');
		}

		// Update only the provided fields
		const updates: Partial<Project> = {};
		if (name) updates.name = name;
		if (description) updates.description = description;

		// Build the SQL query dynamically
		const updateFields = Object.keys(updates)
			.map((key) => `${key} = ?`)
			.join(', ');
		const updateValues = Object.values(updates);

		await dbService.run(
			`UPDATE projects SET ${updateFields} WHERE id = ?`,
			[...updateValues, id],
		);

		// Get the updated project
		const updatedProject = await dbService.get(
			'SELECT * FROM projects WHERE id = ?',
			[id],
		);

		res.status(200).json(updatedProject);
	},
);

export const deleteProject = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		// Check if project exists
		const existingProject = await dbService.get(
			'SELECT * FROM projects WHERE id = ?',
			[id],
		);

		if (!existingProject) {
			throw new NotFoundError('Project not found');
		}

		// First delete all associated reports
		await dbService.run('DELETE FROM reports WHERE project_id = ?', [id]);

		// Then delete the project
		await dbService.run('DELETE FROM projects WHERE id = ?', [id]);

		res.status(200).json({
			message: 'Project and associated reports deleted successfully',
		});
	},
);
