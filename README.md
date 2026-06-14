# CollabEdit - Elite Collaborative Document Editor

CollabEdit is a high-performance, AI-enhanced collaborative document editor designed for elite teams who demand speed, style, and intelligence in their writing workflow.

![App Header](https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200&h=300)

## ✨ Elite Features

### 🚀 Real-Time Collaboration
- **Live Sync**: Instant, conflict-free editing powered by Socket.io.
- **Presence Tracking**: Real-time cursors and active collaborator avatars in the header.
- **Live Selections**: See what others are highlighting to coordinate better.

### 🧠 Collaboration Intelligence
- **AI Contextual Summaries**: Automatic, human-readable summaries of recent document changes.
- **Grammar Magic**: Real-time AI suggestions and grammar improvements as you type.
- **Global News Feed**: A dashboard-level activity feed showing recent insights across all your documents.

### 🎨 Premium Aesthetics
- **Personalized Themes**: Swappable color palettes (Sky Blue & Sunset Gold).
- **Dynamic Mode**: Seamless Light/Dark mode switching with persistent preferences.
- **Glassmorphism**: Modern, translucent UI with smooth micro-animations.

### 🗳️ Team Coordination
- **Integrated Polls**: Create and vote on changes directly within the document sidebar.
- **Member Management**: Easily add and manage collaborators for every project.
- **Guest-First Design**: Smooth transition from anonymous guest editing to authenticated ownership.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Lucide React Icons
- Socket.io-client
- Axios & Zustand

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Socket.io
- AI Integration (LLM-ready)

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Backend Setup
```bash
cd Backend
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📁 Technical Architecture & Structure

### 🖥️ Frontend (React + Vite)
Built for speed and reactivity, the frontend uses a modular component architecture.

**Key Packages:**
- `socket.io-client`: Real-time bi-directional communication.
- `lucide-react`: Premium, customizable iconography.
- `axios`: Promise-based HTTP client for API requests.
- `react-router-dom`: Declarative routing for navigation.

**Directory Structure:**
```text
frontend/src/
├── components/    # Atomic UI elements (Button, Loader, Navbar)
├── context/       # Global state (ThemeContext for palettes & mode)
├── hooks/         # Custom React hooks (useAuth for identity)
├── pages/         # Full-page views (Dashboard, Editor, Settings)
├── services/      # API abstraction layer (api.js)
├── utils/         # Helper functions (Coordinate calculation)
└── index.css      # Design system & theme variables
```

### ⚙️ Backend (Node.js + Express)
A robust, secure API and Socket server designed for data integrity and low latency.

**Key Packages:**
- `socket.io`: Real-time engine for document sync and presence.
- `mongoose`: Elegant MongoDB object modeling.
- `jsonwebtoken`: Secure stateless authentication.
- `bcryptjs`: Industry-standard password hashing.

**Directory Structure:**
```text
Backend/src/
├── config/        # Database and environment configuration
├── controllers/   # Request handlers & AI logic (docController, authController)
├── middleware/    # Auth guards and global error handling
├── models/        # Mongoose data schemas (User, Document)
├── routes/        # Express API endpoint definitions
└── socketHandler.js # Real-time event logic (presence, sync, activity)
```

---

## 🚦 Getting Started

*Built for those who value speed, beauty, and collaborative intelligence.*
