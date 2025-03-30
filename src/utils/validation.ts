/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from './errorHandler';

export interface ValidationSchema {
	[key: string]: {
		required?: boolean;
		type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
		minLength?: number;
		maxLength?: number;
		min?: number;
		max?: number;
		pattern?: RegExp;
		custom?: (value: any) => boolean | string;
	};
}

export const validate = (schema: ValidationSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const errors: { [key: string]: string } = {};

		for (const [field, rules] of Object.entries(schema)) {
			const value = req.body[field];

			// Check required fields
			if (
				rules.required &&
				(value === undefined || value === null || value === '')
			) {
				errors[field] = `${field} is required`;
				continue;
			}

			// Skip validation if field is not present and not required
			if (value === undefined || value === null) continue;

			// Type validation
			if (rules.type && typeof value !== rules.type) {
				if (!(rules.type === 'array' && Array.isArray(value))) {
					errors[field] = `${field} must be a ${rules.type}`;
					continue;
				}
			}

			// String validations
			if (typeof value === 'string') {
				if (
					rules.minLength !== undefined &&
					value.length < rules.minLength
				) {
					errors[field] =
						`${field} must be at least ${rules.minLength} characters`;
				}

				if (
					rules.maxLength !== undefined &&
					value.length > rules.maxLength
				) {
					errors[field] =
						`${field} must be at most ${rules.maxLength} characters`;
				}

				if (rules.pattern && !rules.pattern.test(value)) {
					errors[field] = `${field} has an invalid format`;
				}
			}

			// Number validations
			if (typeof value === 'number') {
				if (rules.min !== undefined && value < rules.min) {
					errors[field] = `${field} must be at least ${rules.min}`;
				}

				if (rules.max !== undefined && value > rules.max) {
					errors[field] = `${field} must be at most ${rules.max}`;
				}
			}

			// Custom validation
			if (rules.custom) {
				const result = rules.custom(value);
				if (result !== true) {
					errors[field] =
						typeof result === 'string'
							? result
							: `${field} is invalid`;
				}
			}
		}

		if (Object.keys(errors).length > 0) {
			next(new BadRequestError('Validation failed', errors));
		} else {
			next();
		}
	};
};

// Validation schemas
export const projectSchema: ValidationSchema = {
	name: {
		required: true,
		type: 'string',
		minLength: 3,
		maxLength: 100,
	},
	description: {
		required: true,
		type: 'string',
	},
};

export const reportSchema: ValidationSchema = {
	text: {
		required: true,
		type: 'string',
	},
	project_id: {
		required: true,
		type: 'string',
	},
};
