const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Helper to check DB connection
const isDbConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback data
const fallbackProjects = [
  {
    _id: '1',
    title: 'E-Commerce REST API',
    description: 'A scalable REST API built with Java Spring Boot featuring authentication, product management, and order processing with MySQL database.',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'REST API', 'JWT'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    category: 'backend',
    featured: true,
    createdAt: new Date(),
  },
  {
    _id: '2',
    title: 'MERN Stack Task Manager',
    description: 'Full-stack task management application with real-time updates, drag-and-drop boards, user authentication, and MongoDB persistence.',
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.com',
    category: 'fullstack',
    featured: true,
    createdAt: new Date(),
  },
  {
    _id: '3',
    title: 'Analytics Dashboard',
    description: 'Interactive data analytics dashboard with real-time charts, MySQL stored procedures, and a responsive HTML/CSS/JS frontend.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'MySQL', 'Node.js', 'Chart.js'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    category: 'fullstack',
    featured: false,
    createdAt: new Date(),
  },
  {
    _id: '4',
    title: 'Node.js CLI Automation Tool',
    description: 'A command-line tool for automating repetitive development tasks including file scaffolding, code generation, and deployment scripts.',
    techStack: ['Node.js', 'JavaScript', 'Commander.js', 'Inquirer'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    category: 'backend',
    featured: false,
    createdAt: new Date(),
  },
  {
    _id: '5',
    title: '2D Browser Game Engine',
    description: 'A lightweight 2D game engine built with vanilla JavaScript and HTML5 Canvas, featuring a physics system, sprite animations, and collision detection.',
    techStack: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'Web Audio API'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.com',
    category: 'frontend',
    featured: true,
    createdAt: new Date(),
  },
  {
    _id: '6',
    title: 'MongoDB Inventory System',
    description: 'A warehouse inventory management system with MongoDB aggregation pipelines, batch operations, Express.js API and a clean HTML/JS frontend.',
    techStack: ['MongoDB', 'Node.js', 'Express.js', 'HTML', 'CSS'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    category: 'fullstack',
    featured: false,
    createdAt: new Date(),
  },
];

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, data: fallbackProjects, source: 'fallback' });
    }
    const Project = require('../models/Project');
    const projects = await Project.find().sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const p = fallbackProjects.find(p => p._id === req.params.id);
      if (!p) return res.status(404).json({ success: false, message: 'Project not found' });
      return res.json({ success: true, data: p });
    }
    const Project = require('../models/Project');
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    const Project = require('../models/Project');
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:id
router.put('/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    const Project = require('../models/Project');
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    const Project = require('../models/Project');
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
