# 2. Technology Stack

## 🌐 Frontend (State-of-the-Art UI/UX)
- **Framework**: React 19 + Vite (Next-gen bundling)
- **Styling**: Tailwind CSS v4 (Modern CSS-first approach)
- **Components**: Shadcn/UI (Premium, accessible components)
- **State Management**: Redux Toolkit (Slices for Auth, Profile, Chat, Events)
- **Animations**: Framer Motion & GSAP (High-fidelity transitions and visual flair)
- **Charts**: Recharts (Dynamic SVG-based data visualization)
- **Real-Time**: Socket.io-client (Persistent bidirectional communication)

## ⚙️ Backend (Robust API Infrastructure)
- **Environment**: Node.js
- **Framework**: Express.js with TypeScript
- **Security**: Helmet (Header security), CORS, Cookie-parser
- **Real-Time Server**: Socket.io (Event-driven architecture with custom room management)
- **Cloud Storage**: ImageKit.io (Media management and transformation)

## 🗄️ Database & Models
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **ODM**: Mongoose (Schema-driven data modeling)
- **Indexing**: Optimized compound indexes for recommendation performance

## 🤖 AI & Logic Layer
- **Recommendation Engine**: Custom weighted-scoring algorithm (Interest Match + Registration Popularity)
- **Logic**: Rule-based explainability layer for AI transparency
- **Social Graph**: Peer-to-peer interest matching for user suggestions

## 🔐 Authentication & Security
- **Type**: Dual-Token Architecture (Access + Refresh Tokens)
- **Storage**: HttpOnly Cookies for Refresh Tokens (Cross-Site Scripting protection)
- **Hashing**: Argon2 / Bcrypt for robust password security
- **Middleware**: Role-based access control (Student vs. Organizer)

## 🚀 Deployment & Infrastructure
- **Full-Stack Hosting**: Vercel (Optimized via `api/` serverless functions and `vercel.json` rewrites)
- **Versioning**: Git-based CI/CD flow
- **Environment**: Production-ready environment variables management