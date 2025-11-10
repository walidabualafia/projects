# Project Management Platform

A simple Node.js project management platform to manage projects and tasks with effort prioritization.

## Features

- Create and manage multiple projects
- Add tasks to projects with effort estimates (1-10)
- View tasks sorted by effort (highest effort first)
- Track project completion progress
- Mark tasks as complete
- Track total effort and completion percentage
- Mark entire projects as complete
- Clean, intuitive web interface

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Usage

### Creating a Project
1. On the home page, enter a project name and optional description
2. Click "Create Project"

### Managing Tasks
1. Click on a project card to view its details
2. Add tasks with a title, description, and effort estimate (1-10)
3. Tasks are automatically sorted by effort (highest first)
4. Check the checkbox to mark tasks as complete
5. Track your progress with the visual progress bar

### Completing Projects
1. Open a project
2. Click "Mark Project Complete" when all work is done
3. Completed projects appear with reduced opacity in the projects list

### Viewing Project Stats
Each project displays:
- Total tasks vs completed tasks
- Total effort points vs completed effort points
- Completion percentage with visual progress bar

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project with tasks
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project and all its tasks

### Tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Data Storage

The application uses in-memory storage. Data will be lost when the server restarts. For persistent storage, consider integrating a database like SQLite, PostgreSQL, or MongoDB.

## Technology Stack

- Node.js
- Express.js
- Vanilla JavaScript
- HTML5 & CSS3
