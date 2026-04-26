# PLAN: EventEase AI Recommendation System (MMVP)

## 🎯 Executive Summary
EventEase is an AI-assisted event recommendation platform designed for college students. This document outlines the structured implementation plan across User Roles, Page Types, and Technical Specialties to deliver a production-grade Minimum Marketable Viable Product (MMVP).

---

## 👥 User Role Blueprint

### 1. Student (Primary End User)
- **Goal:** Discover highly relevant events with zero friction.
- **MMVP Journey:**
  - Registers/Logs in securely.
  - Completes "Discovery Onboarding" by selecting interests/tags.
  - Lands on "Student Dashboard" featuring AI-curated event recommendations.
  - Views "Event Details" with an AI-generated explanation of *why* it was recommended.
  - Clicks "Register" and tracks registered events.

### 2. Event Organizer
- **Goal:** Publish events and track engagement metrics.
- **MMVP Journey:**
  - Authenticates as an Organizer.
  - Navigates to "Organizer View" to list new events (Title, Date, Tags, Max Participants).
  - Views the "Organizer Analytics" dashboard to see real-time ticket sales and registration metrics.

### 3. Administrator / Event Intelligence
- **Goal:** Oversee platform health and derive advanced event insights.
- **MMVP Journey:**
  - Accesses "AI Insights Dashboard" and "Event Intelligence Detail".
  - Monitors high-level platform analytics (overall attendance rates, top tags).

---

## 📄 Page Type Architecture

Based on the validated UI/UX designs, the following pages will be built:

| Page Name | Role Access | Primary Purpose | Key Features |
|-----------|-------------|-----------------|--------------|
| **Discovery Onboarding** | Student | Initial data capture | Interest bubbles, preference selection, POST to user profile. |
| **Student Dashboard** | Student | Central hub | Personalized feed, Quick stats, Global search, Top recommendations. |
| **Event Details** | All | Deep dive | Event metadata, Groq AI explainability block ("Why this?"), Registration CTA. |
| **Organizer View** | Organizer | Event management | CRUD operations for events, Status badges. |
| **Organizer Analytics** | Organizer | Performance tracking | KPI cards (revenue/attendance), basic charts (Recharts). |
| **AI Insights Dashboard** | Admin | Platform oversight | Trend indicators, health scores, automated alerts. |

---

## 🛠 Specialty Execution Plan

### 1. Frontend Specialty (React, Vite, Tailwind v4, Shadcn)
- **Setup:** `npm create vite@latest . -- --template react` + Tailwind v4 + Shadcn UI initialization.
- **State Management:** Redux Toolkit for user session and cached event feeds.
- **Routing:** React Router v6 (Public, Protected Student, Protected Organizer routes).
- **Styling:** Adhere strictly to the "Obsidian Loom" / "EventEase Smart Dashboard" Dark/Light mode tokens established in `designs/*.mmd`.

### 2. Backend Specialty (Node.js, Express)
- **Setup:** Modular Monolithic architecture (`/routes`, `/controllers`, `/models`, `/services`, `/middlewares`).
- **Security:** Helmet, CORS, Rate Limiting.
- **Auth:** JWT and Bcrypt for secure login.
- **Endpoints:** 
  - `POST /api/auth/register` & `POST /api/auth/login`
  - `GET /api/events/recommendations`
  - `POST /api/events` (Organizer only)

### 3. Database Specialty (MongoDB Atlas, Mongoose)
- **Schema Implementation:**
  - `User`: email, password, role, interests[].
  - `Event`: title, description, tags[], location, organizerId, metrics.
  - `Registration`: userId, eventId, status.
- **Indexing:** Fast tag filtering and chronological sorting on dates.

### 4. AI & Logic Specialty (Groq API)
- **Engine Setup:** Integrate Groq SDK (using the blazing fast Llama 3 or Mixtral models).
- **Matching Algorithm:** Filter database events by matching tags, then send user context and top events to Groq API.
- **Explainability Generation:** Prompt Groq to generate a 1-sentence personalized explanation (e.g., *"Recommended because you like Tech and this has a 95% match with your interests."*).

---

## 🚀 MMVP Phased Implementation

### Phase 1: Core Foundation (Backend & DB)
- Set up MongoDB Atlas cluster.
- Initialize Node.js/Express repository.
- Implement User and Event schemas.
- Build Authentication (JWT) and Role-Based Access Control (RBAC).

### Phase 2: AI & API Layer
- Implement Groq API integration in backend services.
- Build the recommendation endpoint (`/api/events/recommended`).
- Expose basic CRUD endpoints for Organizer events.

### Phase 3: Frontend Scaffolding & Integration
- Setup Vite + React + Tailwind v4 + Shadcn UI.
- Implement routing and Auth Context (Redux).
- Build the `Discovery Onboarding` flow and `Student Dashboard`.
- Connect to backend API.

### Phase 4: Polish & Analytics
- Build `Organizer View` and `Organizer Analytics` (using Recharts).
- Apply Light/Dark mode design system globally.
- E2E testing and Vercel/Render deployment prep.

---
**Status:** Plan Approved. Proceeding to Phase 1.
