import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './utils/errorHandler';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
	res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling for undefined routes
app.use('*', (req: Request, res: Response) => {
	res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

export default app;
