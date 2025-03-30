/* eslint-disable @typescript-eslint/no-explicit-any */
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';

class DatabaseService {
	private db: Database | null = null;

	constructor() {
		this.initializeDbConnection();
	}

	private async initializeDbConnection() {
		try {
			this.db = await open({
				filename: path.resolve(__dirname, '../../db/db.sqlite3'),
				driver: sqlite3.Database,
			});

			console.log('Database connection established successfully');
		} catch (error) {
			console.error('Failed to connect to the database:', error);
			process.exit(1);
		}
	}

	async query(sql: string, params: any[] = []): Promise<any> {
		if (!this.db) {
			await this.initializeDbConnection();
		}

		try {
			return await this.db!.all(sql, params);
		} catch (error) {
			console.error('Database query error:', error);
			throw error;
		}
	}

	async run(sql: string, params: any[] = []): Promise<any> {
		if (!this.db) {
			await this.initializeDbConnection();
		}

		try {
			return await this.db!.run(sql, params);
		} catch (error) {
			console.error('Database run error:', error);
			throw error;
		}
	}

	async get(sql: string, params: any[] = []): Promise<any> {
		if (!this.db) {
			await this.initializeDbConnection();
		}

		try {
			return await this.db!.get(sql, params);
		} catch (error) {
			console.error('Database get error:', error);
			throw error;
		}
	}
}

// Create a singleton instance
const dbService = new DatabaseService();
export default dbService;
