# 📅 EventEase

<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-react/lucide/main/icons/calendar-heart.svg" alt="EventEase Logo" width="120" height="120" />
  <br />
  <p><b>AI-Powered Event Recommendation & Real-Time Visualization Ecosystem</b></p>
</div>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-platform-walkthrough">Walkthrough</a> •
  <a href="#-installation--setup">Installation</a> •
  <a href="#-security--performance-highlights">Security</a>
</p>

---

## 🎯 Overview

**EventEase** is a production-grade, AI-driven event discovery and real-time social platform engineered to connect individuals with meaningful opportunities. By leveraging advanced reasoning models (Groq/Llama-3), it curates personalized events based on interests, historical engagement, and trends.

Beyond discovery, EventEase is a fully featured social hub with real-time 1:1 messaging, automated event group chats, and insightful analytics—all wrapped in a stunning, modern dark-mode UI built with React 19, Tailwind CSS v4, and Framer Motion.

## ✨ Key Features

### 🧠 AI-Powered Curation & Analytics
- **Weighted Match Scoring:** Intelligent ranking based on user interests, engagement, and registration velocity.
- **Explainable AI (XAI):** Transparent AI insights powered by Groq/Llama-3 that explain *why* an event was recommended to you.
- **Dynamic Radar & Trend Charts:** Real-time data visualization (Recharts) mapping your interest alignment across categories.

### 💬 Real-Time Social Engine
- **Unified Messaging:** Instant peer-to-peer and group chat infrastructure powered by **Socket.IO**.
- **Automated Event Channels:** Dedicated **Discussion** and **Announcement** channels auto-generated for every event.
- **"People You May Know":** An intelligent social graph suggesting connections based on overlapping interests.

### 🎨 Premium UI/UX & Onboarding
- **High-Fidelity Onboarding:** Multi-step flow for interest curation and profile customization (bio, social links, cloud avatars).
- **Responsive & Fluid:** Mobile-first architecture with glassmorphism design, powered by **Tailwind CSS v4** and **Framer Motion**.
- **Role-Based Dashboards:** Distinct, optimized views and controls for Students (Attendees) and Organizers.

### 🛠️ Organizer Command Center
- **Advanced Management:** Tools to track live registrations, manage attendance, and blacklist users for secure event hosting.
- **Flexible Media System:** Dual-mode banner system supporting secure cloud uploads via **ImageKit** or external URL integration.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4, Lucide React (Icons)
- **State Management:** Redux Toolkit
- **Animations:** Framer Motion, GSAP
- **Data Visualization:** Recharts
- **Networking:** Axios, Fetch API, Socket.IO Client

### Backend
- **Environment:** Node.js + Express.js (TypeScript)
- **Database:** MongoDB Atlas + Mongoose ODM
- **Real-Time:** Socket.IO
- **AI Integration:** Groq SDK (Llama-3 models)
- **Authentication:** JWT (Access & HttpOnly Refresh Tokens), Bcryptjs
- **Media Storage:** ImageKit.io

---

## 📸 Platform Walkthrough

*(Note: Replace placeholder image links with actual screenshots in your repository's `docs/screenshots` folder)*

| Discovery Dashboard | Real-Time Chat |
| :---: | :---: |
| <img src="docs/screenshots/11_dashboard_student.png" width="400" alt="Dashboard" /> | <img src="docs/screenshots/01_discovery_unauthenticated.png" width="400" alt="Chat" /> |
| **Personalized AI Radar & Trending Events** | **1:1 and Group Event Messaging** |

| Event Creation | High-Fidelity Profile |
| :---: | :---: |
| <img src="docs/screenshots/02_register_page.png" width="400" alt="Event Creation" /> | <img src="docs/screenshots/profile.png" width="400" alt="Profile" /> |
| **Organizer Command Center** | **Interest Tags & Connections** |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Groq API Key
- ImageKit Credentials

### 1. Clone the repository
```bash
git clone https://github.com/Purushotham-Prajapati-24/EEventEase-AI-Based-Event-Recommendation-Visualization-System.git
cd EEventEase-AI-Based-Event-Recommendation-Visualization-System
```

### 2. Configure Backend
```bash
cd backend
npm install

# Create a .env file and add:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
GROQ_API_KEY=your_groq_key
GROQ_FALLBACK_API_KEY=your_groq_fallback_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
FRONTEND_URL=http://localhost:5173

npm run dev
```

### 3. Configure Frontend
```bash
cd ../frontend
npm install

# Create a .env file and add:
VITE_BACKEND_URL=http://localhost:5000
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
VITE_IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint

npm run dev
```

---

## 🛡️ Security & Performance Highlights
- **Resilient Auth:** Implemented a Refresh Promise Lock in the frontend to prevent concurrent token refresh request races and avoid aggressive logouts during network instability.
- **AI Failover:** Backend features an API key failover mechanism to seamlessly switch to a fallback key if the primary Groq API hits rate limits (HTTP 429).
- **Cross-Domain Ready:** Configured backend CORS and `SameSite=None` cookies to support decoupled production deployments (e.g., Frontend on Vercel, Backend on Render).
- **XSS Protection:** Refresh tokens are securely stored in `HttpOnly` cookies and never exposed to client-side JavaScript.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <br/>
  <b>Built with ❤️ by the EventEase Team</b>
</div>
