# Projects and Reports API

A RESTful API for managing company projects and their associated reports. Built with TypeScript, Express.js, and SQLite.

## Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

## Setting Up the Project

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   
4. Start the development server:
   ```bash
   npm run dev
   ```
   
   The server will be running at http://localhost:3000.
   

## Project Structure

```
src/
├── index.ts                    # Main application entry point
├── db/
│   └── db.service.ts           # Database service for SQL queries
├── middleware/
│   └── auth.middleware.ts      # Authentication middleware
├── routes/
│   ├── projects.routes.ts      # Project routes
│   ├── reports.routes.ts       # Report routes
│   └── index.ts                # Routes export
├── controllers/
│   ├── projects.controller.ts  # Project controller
│   ├── reports.controller.ts   # Report controller
│   └── index.ts                # Controller export
├── models/
│   ├── projects.model.ts       # Project model
│   └── reports.model.ts        # Report model
└── utils/
    ├── errorHandler.ts         # Error handling utility
    └── validation.ts           # Data validation utility
```

## Available Endpoints

### Authentication

All API routes are secured with a hardcoded authentication token. Include the following header in all requests:

```
Authorization: Bearer Password123
```

### Projects

- **GET /api/projects** - Get all projects
- **GET /api/projects/:id** - Get a specific project by ID (includes associated reports)
- **POST /api/projects** - Create a new project
  - Required fields: `name` and `description`
- **PUT /api/projects/:id** - Update a project
  - At least one field (`name` or `description`) is required
- **DELETE /api/projects/:id** - Delete a project and all associated reports

### Reports

- **GET /api/reports** - Get all reports
- **GET /api/reports/:id** - Get a specific report by ID
- **GET /api/reports/repeated-words** - Get reports where a word appears at least three times
- **POST /api/reports** - Create a new report
  - Required fields: `text` and `project_id`
- **PUT /api/reports/:id** - Update a report
  - At least one field (`text` or `project_id`) is required
- **DELETE /api/reports/:id** - Delete a report

## Request Examples

### Creating a Project

```
POST /api/projects
Authorization: Bearer Password123
Content-Type: application/json

{
  "name": "Mobile App Development",
  "description": "Develop a mobile application for iOS and Android platforms"
}
```

### Creating a Report

```
POST /api/reports
Authorization: Bearer Password123
Content-Type: application/json

{
  "text": "Progress report for the mobile app development project. The project is on track. We have completed the UI design and started the implementation.",
  "project_id": "1"
}
```



## Database Schema

The application uses a SQLite database with the following schema:

### Projects Table
- `id` (TEXT): Primary key for the project
- `name` (TEXT): Name of the project
- `description` (BIGINT): Detailed description of the project

### Reports Table
- `id` (TEXT): Primary key for the report
- `text` (TEXT): Content of the report
- `project_id` (TEXT): Foreign key referencing the project this report belongs to

## Development Notes

- The application uses environment variables for configuration. See `.env.example` for available options.
- Authentication is implemented using a hardcoded token for simplicity. In a production environment, this should be replaced with a more secure authentication method.
- Error handling is centralized in the `errorHandler.ts` utility.
- Input validation is implemented using custom validation middleware.

