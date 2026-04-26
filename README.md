# EventEase: AI-Powered Event Recommendation & Community Platform

![Banner](https://raw.githubusercontent.com/lucide-react/lucide/main/icons/calendar-heart.svg)

**EventEase** is a production-grade, AI-driven event discovery and real-time social ecosystem designed for modern university campuses. It leverages advanced reasoning models to connect students with meaningful opportunities while providing a seamless, real-time communication layer.

---

## 🚀 Key Features

### 🧠 AI-Powered Curation
- **Weighted Match Scoring**: Intelligent ranking based on user interests, historical engagement, and registration velocity.
- **Explainable Recommendations**: Transparent AI insights (powered by Groq/Llama-3) that explain *why* an event was suggested.
- **Dynamic Radar Charts**: Real-time visualization of your interest alignment across campus categories.

### 💬 Real-Time Social Engine
- **Unified Messaging**: Seamless peer-to-peer and group chat infrastructure powered by **Socket.IO**.
- **Automated Event Channels**: Dedicated **Discussion** (for students) and **Announcement** (for organizers) channels for every event.
- **Social Suggestions**: A "People You May Know" discovery engine that connects students sharing similar academic and extracurricular interests.

### 📱 Premium Onboarding & UI/UX
- **Multi-Step Onboarding**: High-fidelity flow for interest curation and profile customization (Bio + Cloud-hosted Avatars).
- **Responsive Design**: Mobile-first architecture using **React 19** and **Tailwind CSS v4**.
- **Visual Intelligence**: Interactive dashboards using **GSAP** animations and **Recharts** for trend analysis.

### 🛠️ Organizer Command Center
- **Advanced Management**: Tools to track registrations, manage attendance, and blacklist users for secure event hosting.
- **Flexible Content**: Dual-mode banner system supporting cloud uploads via **ImageKit** or external URL integration.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Redux Toolkit, Framer Motion, Recharts, GSAP |
| **Backend** | Node.js, Express.js (TypeScript), Socket.IO |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Media** | ImageKit.io (Cloud Storage & Transformation) |
| **AI Layer** | Groq SDK (Llama-3-70b-versatile) |
| **Auth** | Dual-Token (Access + Refresh) Architecture with HttpOnly Cookies |
| **Hosting** | Vercel (Optimized Serverless Integration) |

---

## 📸 Platform Walkthrough

### 1. High-Fidelity Onboarding
Personalize your experience from second one. Pick your niche interests and set up your campus identity.
![Onboarding](docs/screenshots/02_register_page.png)

### 2. AI Spotlight Dashboard
Your personalized command center showing your interest radar and top picks.
![Dashboard](docs/screenshots/11_dashboard_student.png)

### 3. Real-Time Chat & Community
Connect with peers and stay updated with official event announcements instantly.
![Chat](docs/screenshots/01_discovery_unauthenticated.png)

---

## 📦 Installation & Setup

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
# Create a .env file:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# REFRESH_TOKEN_SECRET=your_refresh_secret
# GROQ_API_KEY=your_key
# IMAGEKIT_PUBLIC_KEY=your_key
# IMAGEKIT_PRIVATE_KEY=your_key
# IMAGEKIT_URL_ENDPOINT=your_endpoint
npm run dev
```

### 3. Configure Frontend
```bash
cd ../frontend
npm install
# Create a .env file:
# VITE_API_URL=/api
# VITE_BACKEND_URL=http://localhost:5000
# VITE_IMAGEKIT_PUBLIC_KEY=your_key
# VITE_IMAGEKIT_URL_ENDPOINT=your_endpoint
npm run dev
```

---

## 🛡️ Security & Performance
- **XSS Protection**: Refresh tokens stored in `HttpOnly` cookies.
- **Serverless Optimized**: Cleanly decoupled API routes for Vercel deployment.
- **Data Integrity**: Schema-level validation and comprehensive error handling.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

Built with ❤️ by the EventEase Team.
