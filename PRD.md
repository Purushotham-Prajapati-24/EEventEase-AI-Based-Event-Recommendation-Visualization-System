# 📋 Product Requirements Document (PRD)

## 🎯 Product Overview
**EventEase** is a high-performance, AI-assisted event recommendation and visualization platform designed for university students and campus organizations. By leveraging intelligent scoring algorithms, large language models (LLMs), and real-time social features, it transforms the fragmented event discovery process into a highly personalized, data-driven journey.

## ❗ Problem Statement
University ecosystems suffer from:
1. **Information Overload**: Constant noise from multiple club announcements across fragmented platforms (WhatsApp, Instagram, Notice Boards).
2. **Generic Experiences**: A lack of personalized curation leads to students missing out on niche opportunities tailored to their specific career or hobby interests.
3. **Static Discovery**: Current platforms lack real-time interaction, community building, and visibility into trending campus activities.

## 💡 Proposed Solution
EventEase is a centralized ecosystem that:
- **Analyzes**: Uses interest-based scoring and popularity metrics to rank events.
- **Visualizes**: Provides dynamic dashboards (Radar, Bar, Line charts) for visual trend analysis.
- **Connects**: Facilitates real-time community interaction through dedicated event chats and peer-to-peer networking.
- **Explains**: Offers Explainable AI (XAI) transparency into exactly *why* an event was recommended to the user.

## 👥 Target Audience
- **Students (Attendees)**: Seeking relevant workshops, hackathons, cultural fests, and networking opportunities.
- **Organizers (Clubs/Admins)**: Looking to maximize reach, manage attendee engagement, and broadcast announcements.

---

## ⚙️ Core Features & Requirements

### 1. Advanced Personalization & Onboarding
- **Interest Curation**: Guided onboarding flow allowing users to select highly specific niche tags (e.g., Coding, Finance, Robotics, Art).
- **Social Graph ("People You May Know")**: An intelligent recommendation module suggesting connections based on overlapping interests and mutual connections.

### 2. Intelligent AI Recommendation Engine
- **Hybrid Match Scoring**: Combines **Interest Match** (profile alignment) and **Popularity Weight** (registration velocity/capacity).
- **Explainable AI (XAI)**: Utilizes the Groq API (Llama models) to generate human-readable context for recommendations (e.g., *"Matches your interest in Machine Learning and is currently trending among CS students."*).
- **Failover Mechanism**: Resilient AI service with automatic fallback API keys to handle rate limiting (HTTP 429).

### 3. Real-Time Social Ecosystem (Socket.IO)
- **Instant Messaging**: Low-latency 1:1 direct messaging restricted to mutually connected users for privacy.
- **Automated Event Channels**: 
  - **Discussion Feed**: Auto-generated chat room for attendees to network and discuss the event.
  - **Announcements Channel**: Read-only channel where only organizers can broadcast critical updates (pushing real-time UI notifications to attendees).
- **Read Receipts**: WhatsApp-style message tracking (`message-read` events).

### 4. Visual Intelligence Dashboard
- **Interest Radar**: A dynamic Recharts-based radar graph visualizing how a user's profile aligns with current campus offerings.
- **Trending Metrics**: Visual indicators showing registration peaks, capacity status, and hot categories.

### 5. Seamless Event Management
- **Media Handling**: Support for external image URLs or secure ImageKit cloud uploads for event banners.
- **Attendee Control**: Comprehensive dashboard tools for organizers to track capacity, manage RSVPs, and remove/blacklist disruptive attendees.
- **Lifecycle Management**: Organizers can mark events as "Completed," finalizing the attendee list and locking further registrations.

---

## 🛡️ Security & Technical Architecture
- **Dual-Token Authentication**: High-security architecture using short-lived Access Tokens (memory/local) and long-lived Refresh Tokens (HttpOnly, Secure, SameSite=None cookies).
- **Resilient State Management**: Redux Toolkit for complex UI states, paired with an Axios/Fetch interceptor featuring a "Refresh Promise Lock" to prevent race conditions during token renewal.
- **Cross-Domain Ready**: Decoupled architecture ready for serverless deployment (Frontend on Vercel, Backend on Render) with dynamic CORS origin reflection.
- **Real-Time Guardrails**: Socket.io middleware enforcing secure personal room joining and authorization checks for group messaging.