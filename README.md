# EventEase: AI-Powered Event Recommendation Platform

![Logo](https://raw.githubusercontent.com/lucide-react/lucide/main/icons/calendar-heart.svg)

**EventEase** is a production-grade, AI-driven event discovery and recommendation system tailored for college campuses. It leverages advanced reasoning models to connect students with events that match their interests, skills, and social preferences.

## 🚀 Features

- **AI-Driven Discovery**: Personalized event recommendations using Groq-powered AI analysis.
- **Smart Dashboard**: Role-based access for Students, Organizers, and Admins.
- **Dynamic Event Management**: Real-time event tracking, registration, and capacity management.
- **Modern UI/UX**: Built with React, Tailwind CSS, and Shadcn UI for a premium, accessible experience.
- **Secure Authentication**: Robust JWT-based authentication with role-protected routes.

---

## 📸 Platform Walkthrough

### 1. Discovery & Personalization
Explore all campus events. Once logged in, the AI analyzes your interests to provide curated recommendations.

![Discovery Unauthenticated](docs/screenshots/01_discovery_unauthenticated.png)
*Initial view for guest users*

![Discovery Authenticated](docs/screenshots/04_discovery_authenticated.png)
*AI-personalized recommendations for logged-in students*

### 2. Seamless Registration
Fast and intuitive onboarding with interest-based profiling.

![Register Page](docs/screenshots/02_register_page.png)
*Comprehensive user profiling*

### 3. Student Dashboard
Manage your registrations and see top picks at a glance.

![Dashboard](docs/screenshots/11_dashboard_student.png)
*Personalized command center*

### 4. Organizer View
Specialized tools for campus event planners.

![Organizer View](docs/screenshots/10_organizer_view.png)
*Administrative access for event management*

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Redux Toolkit, React Router 7 |
| **Styling** | Tailwind CSS 4, Shadcn UI, Lucide Icons |
| **Backend** | Node.js, Express 5, Mongoose |
| **AI/ML** | Groq SDK (Llama-3-70b-versatile) |
| **Database** | MongoDB Atlas |
| **Auth** | JWT (JSON Web Tokens), Bcrypt.js |

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Groq API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Purushotham-Prajapati-24/EEventEase-AI-Based-Event-Recommendation-Visualization-System.git
   cd EEventEase-AI-Based-Event-Recommendation-Visualization-System
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env file with PORT, MONGO_URI, JWT_SECRET, and GROQ_API_KEY
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🛡️ Security & Performance
- **Data Protection**: Industry-standard encryption for passwords and sensitive data.
- **Performance**: Optimized asset delivery and state management via Redux Toolkit.
- **Accessibility**: WCAG-compliant UI components and semantic HTML.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

Built with ❤️ by the EventEase Team.
