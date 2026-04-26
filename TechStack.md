# 🛠️ Technology Stack

This document outlines the core technologies, libraries, and architectural decisions powering the EventEase platform.

---

## 🌐 Frontend (Client-Side)
The frontend is designed for a state-of-the-art UI/UX, prioritizing performance, responsiveness, and premium aesthetics.

- **Core Framework**: React 19 + Vite (Next-generation, ultra-fast bundling).
- **Language**: TypeScript (Strict typing for robust state and prop management).
- **Styling**: Tailwind CSS v4 (Modern, utility-first CSS framework for rapid UI development).
- **UI Components**: Shadcn/UI & Radix UI (Unstyled, accessible component primitives).
- **Icons**: Lucide React.
- **State Management**: Redux Toolkit (Slices for Auth, Profile, Chat, and Recommendations).
- **Animations**: 
  - Framer Motion (Fluid layout transitions and micro-interactions).
  - GSAP (Complex timeline-based animations).
- **Data Visualization**: Recharts (Dynamic, composable SVG-based charts for the dashboard).
- **Real-Time Communication**: Socket.io-client (Persistent bidirectional WebSocket communication).
- **Routing**: React Router DOM (v6).

---

## ⚙️ Backend (Server-Side)
A robust, scalable API infrastructure designed to handle real-time events, secure authentication, and complex AI processing.

- **Environment**: Node.js.
- **Framework**: Express.js with TypeScript.
- **Database ODM**: Mongoose (Schema-driven data modeling).
- **Real-Time Server**: Socket.io (Event-driven architecture with custom room management for 1:1 and group chats).
- **Security & Middleware**: 
  - Helmet (HTTP header security).
  - CORS (Dynamic origin reflection for cross-domain deployments).
  - Cookie-Parser (Secure token extraction).
- **Cloud Storage & CDN**: ImageKit.io (Media management, transformation, and optimization).

---

## 🗄️ Database
- **Database**: MongoDB Atlas (Cloud-hosted NoSQL database).
- **Data Structure**: Highly relational NoSQL schema (Users, Events, Registrations, Chats, Messages, Notifications).
- **Indexing**: Optimized compound indexes applied to `tags`, `email`, and `date` fields to ensure high-performance queries for the recommendation engine.

---

## 🤖 AI & Logic Layer
- **Recommendation Engine**: Custom weighted-scoring algorithm analyzing User Interest Match + Event Registration Popularity.
- **Explainable AI (XAI)**: Groq SDK (utilizing `Llama-3-70b-versatile` or `Llama-3-8b-instant`) to generate human-readable, contextual reasoning for why an event matches a user's profile.
- **Resiliency**: Built-in API key failover mechanism to automatically switch to secondary keys upon encountering `429 Too Many Requests` limits.

---

## 🔐 Authentication & Security
- **Architecture**: Dual-Token Architecture.
  - **Access Tokens**: Short-lived (e.g., 15m), stored securely on the client.
  - **Refresh Tokens**: Long-lived (e.g., 7d), stored in `HttpOnly`, `Secure`, `SameSite=None` cookies to prevent XSS and support cross-domain architectures.
- **Hashing**: `bcryptjs` for robust, salted password security.
- **Authorization**: Strict role-based access control (RBAC) middleware differentiating between `student` and `organizer` permissions.

---

## 🚀 Deployment & DevOps
- **Frontend Hosting**: Vercel (Optimized via `vercel.json` rewrites for SPA routing).
- **Backend Hosting**: Render (Node.js Web Service).
- **Versioning**: Git & GitHub (Continuous Integration workflows).
- **Environment Management**: Strict separation of development and production environment variables.