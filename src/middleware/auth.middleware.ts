import { Request, Response, NextFunction } from 'express';

// Hardcoded authentication token as per requirements
const AUTH_TOKEN = 'Password123';

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// Get the auth header
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res
			.status(401)
			.json({ error: 'Authentication token is required' });
	}

	if (token !== AUTH_TOKEN) {
		return res.status(403).json({ error: 'Invalid authentication token' });
	}

	next();
};
