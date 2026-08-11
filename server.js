require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Serve Static Frontend ────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact',  require('./routes/contact'));

// ─── Serve index.html for all non-API routes ──────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ─── Database + Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn('⚠️  No MONGO_URI set in .env — running in mock/demo mode.');
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio server running at http://localhost:${PORT}`);
    console.log('📝 Set MONGO_URI in .env to enable full database features.');
  });
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected');
      app.listen(PORT, () => {
        console.log(`🚀 Portfolio server running at http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      // Still start server even if DB fails (will serve static + 503 on DB routes)
      app.listen(PORT, () => {
        console.log(`⚠️  Server started WITHOUT DB at http://localhost:${PORT}`);
      });
    });
}

module.exports = app;
