require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const projects = [
  {
    title: 'E-Commerce REST API',
    description: 'A production-grade REST API built with Java Spring Boot. Features JWT authentication, role-based access control, product catalogue management, shopping cart, order processing pipeline, and MySQL database with complex queries.',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'JWT', 'REST API', 'Maven'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    category: 'backend',
    featured: true,
  },
  {
    title: 'MERN Stack Task Manager',
    description: 'Full-stack collaborative task management app with real-time updates via WebSockets. Features drag-and-drop Kanban boards, team workspaces, deadline tracking, and MongoDB persistence with Mongoose ODM.',
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io', 'Mongoose'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.com',
    category: 'fullstack',
    featured: true,
  },
  {
    title: 'Analytics Dashboard',
    description: 'Interactive business analytics dashboard with real-time Chart.js visualizations, MySQL stored procedures for complex aggregations, and a responsive vanilla JS frontend with dark/light mode toggle.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'MySQL', 'Node.js', 'Chart.js'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    category: 'fullstack',
    featured: false,
  },
  {
    title: 'Node.js CLI Dev Toolkit',
    description: 'A powerful command-line tool for automating developer workflows. Supports project scaffolding, code generation from templates, automated testing pipelines, and one-command deployment scripts.',
    techStack: ['Node.js', 'JavaScript', 'Commander.js', 'Inquirer.js', 'Chalk'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    category: 'backend',
    featured: false,
  },
  {
    title: '2D Browser Game Engine',
    description: 'A lightweight game engine built entirely with vanilla JavaScript and HTML5 Canvas. Includes physics simulation, sprite sheet animation, tile-map rendering, collision detection, and a Web Audio API sound system.',
    techStack: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'Web Audio API'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.com',
    category: 'frontend',
    featured: true,
  },
  {
    title: 'MongoDB Inventory System',
    description: 'Warehouse inventory management system with MongoDB aggregation pipelines for complex analytics, batch import/export operations, real-time stock alerts, and an Express.js REST API backend.',
    techStack: ['MongoDB', 'Mongoose', 'Node.js', 'Express.js', 'HTML', 'CSS', 'JavaScript'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    category: 'fullstack',
    featured: false,
  },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not set in .env file');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    const inserted = await Project.insertMany(projects);
    console.log(`✅ Seeded ${inserted.length} projects successfully!`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
