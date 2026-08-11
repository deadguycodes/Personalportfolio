# Personal Portfolio — 3D Full-Stack Website

A stunning 3D personal portfolio built with **Node.js/Express**, **MongoDB**, **Three.js**, and **GSAP**.

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd personalportfolio
npm install
```

### 2. Configure environment
```bash
# Copy the example env file
cp .env.example .env
# Edit .env with your MongoDB Atlas URI
```

> **Without MongoDB**: The server still works! Projects are served from in-memory fallback data.

### 3. Start the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Open **http://localhost:5000** 🎉

### 4. Seed the database (optional)
```bash
npm run seed
```

---

## 📁 Project Structure
```
personalportfolio/
├── server.js              # Express entry point
├── routes/
│   ├── projects.js        # CRUD API for projects
│   └── contact.js         # Contact form API
├── models/
│   ├── Project.js         # Mongoose Project schema
│   └── Contact.js         # Mongoose Contact schema
├── seed.js                # DB seeder with 6 sample projects
└── public/
    ├── index.html         # Single-page portfolio
    ├── css/style.css      # Full design system
    └── js/
        ├── three-scene.js # Three.js 3D scenes
        ├── projects.js    # Projects API + cards
        └── main.js        # GSAP + UI interactions
```

---

## 🌐 API Endpoints

| Method | Route             | Description          |
|--------|-------------------|----------------------|
| GET    | /api/projects     | Get all projects     |
| POST   | /api/projects     | Add a project        |
| GET    | /api/projects/:id | Get single project   |
| PUT    | /api/projects/:id | Update a project     |
| DELETE | /api/projects/:id | Delete a project     |
| POST   | /api/contact      | Submit contact form  |

---

## 🎨 Features
- 🌌 **Three.js 3D Hero** — animated particle galaxy + wireframe sphere
- 🔮 **3D Skills Globe** — Fibonacci-distributed rotating tag sphere
- 💎 **Glassmorphism project cards** — 3D tilt on hover, fetched from MongoDB
- ✨ **GSAP ScrollTrigger** — smooth section reveal animations
- 🌀 **Typewriter effect** — cycling role titles
- 📧 **Contact form** — client-side validation + API submission
- 🎯 **Custom cursor** — glowing dot + lagging ring
- 📱 **Fully responsive** — mobile hamburger menu

---

## ☁️ Deployment

### Frontend + Backend (Render)
1. Push to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set `Build Command: npm install`
4. Set `Start Command: npm start`
5. Add env variable: `MONGO_URI`

### Frontend only (Netlify)
Drag the `public/` folder into [Netlify Drop](https://app.netlify.com/drop)

---

## ✏️ Customization
Update these in `public/index.html`:
- Your name (search `Your Name`)
- GitHub/LinkedIn/Email links
- Location, availability status
- Years of experience in hero stats
