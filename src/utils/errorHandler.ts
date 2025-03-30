/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
	statusCode?: number;
	errors?: any;
}

export const errorHandler = (
	err: ApiError,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		error: {
			message: err.message || 'Internal Server Error',
			...(err.errors && { details: err.errors }),
			...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
		},
	});
};

export const asyncHandler = (fn: Function) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

export class NotFoundError extends Error implements ApiError {
	statusCode = 404;

	constructor(message = 'Resource not found') {
		super(message);
		this.name = 'NotFoundError';
	}
}

export class BadRequestError extends Error implements ApiError {
	statusCode = 400;

	constructor(
		message = 'Bad request',
		public errors?: any,
	) {
		super(message);
		this.name = 'BadRequestError';
	}
}

export class UnauthorizedError extends Error implements ApiError {
	statusCode = 401;

	constructor(message = 'Unauthorized') {
		super(message);
		this.name = 'UnauthorizedError';
	}
}

export class ForbiddenError extends Error implements ApiError {
	statusCode = 403;

	constructor(message = 'Forbidden') {
		super(message);
		this.name = 'ForbiddenError';
	}
}
