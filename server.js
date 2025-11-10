const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory data store
let projects = [];
let tasks = [];
let projectIdCounter = 1;
let taskIdCounter = 1;

// Helper function to calculate total effort for a project
function getProjectStats(projectId) {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(t => t.completed).length;
  const totalEffort = projectTasks.reduce((sum, t) => sum + t.effort, 0);
  const completedEffort = projectTasks.filter(t => t.completed).reduce((sum, t) => sum + t.effort, 0);

  return {
    totalTasks,
    completedTasks,
    totalEffort,
    completedEffort,
    completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  };
}

// API Routes

// Get all projects
app.get('/api/projects', (req, res) => {
  const projectsWithStats = projects.map(project => ({
    ...project,
    stats: getProjectStats(project.id)
  }));
  res.json(projectsWithStats);
});

// Get single project with tasks
app.get('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const projectTasks = tasks
    .filter(t => t.projectId === projectId)
    .sort((a, b) => b.effort - a.effort); // Sort by effort (highest first)

  res.json({
    ...project,
    stats: getProjectStats(projectId),
    tasks: projectTasks
  });
});

// Create new project
app.post('/api/projects', (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const newProject = {
    id: projectIdCounter++,
    name,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString()
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { name, description, completed } = req.body;

  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (completed !== undefined) project.completed = completed;

  res.json(project);
});

// Delete project (and all its tasks)
app.delete('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Delete all tasks for this project
  tasks = tasks.filter(t => t.projectId !== projectId);

  // Delete the project
  projects.splice(projectIndex, 1);

  res.json({ message: 'Project deleted successfully' });
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { projectId, title, description, effort } = req.body;

  if (!projectId || !title) {
    return res.status(400).json({ error: 'Project ID and title are required' });
  }

  const project = projects.find(p => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const newTask = {
    id: taskIdCounter++,
    projectId,
    title,
    description: description || '',
    effort: effort || 1, // Default effort of 1
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, effort, completed } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (effort !== undefined) task.effort = effort;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Project Management Platform running on http://localhost:${PORT}`);
});
