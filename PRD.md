# 1. Product Requirements Document (PRD)

## 🎯 Product Overview
**EventEase** is a high-performance, AI-assisted event recommendation and visualization platform specifically engineered for university students. By leveraging intelligent scoring algorithms and real-time social features, it transforms the fragmented event discovery process into a personalized, data-driven journey.

## ❗ Problem Statement
University students often experience:
- **Information Overload**: Constant noise from multiple club announcements across various channels.
- **Generic Experience**: No personalized curation, leading to missed opportunities in niche interests.
- **Static Discovery**: Lack of real-time interaction or visibility into trending campus activities.

## 💡 Proposed Solution
A centralized ecosystem that:
- **Analyzes**: Uses interest-based scoring and popularity metrics to rank events.
- **Visualizes**: Provides dynamic dashboards (Radar, Bar, Line charts) for trend analysis.
- **Connects**: Facilitates real-time community interaction through dedicated event chats.
- **Explains**: Offers AI-driven transparency into why an event is recommended.

## 👥 Target Users
- **Students**: Seeking relevant workshops, hackathons, and cultural fests.
- **Organizers**: Looking to maximize reach and manage attendee engagement.
- **Administration**: Gaining insights into campus engagement trends.

## ⚙️ Core Features

### 1. Advanced Personalization & Onboarding
- **Interest Curation**: Guided onboarding flow to select niche tags (Coding, Finance, Art, etc.).
- **Social suggestions**: "People You May Know" module suggesting connections based on common interests.

### 2. Intelligent Recommendation Engine
- **Hybrid Scoring**: Combines **Match Score** (Interest overlap) and **Popularity Weight** (Registration velocity).
- **Explainable AI (XAI)**: Contextual reasons provided for every recommendation (e.g., *"Matches your interest in Robotics and has high registration velocity"*).

### 3. Real-Time Social Ecosystem
- **Instant Messaging**: Powered by Socket.IO for direct user-to-user and event-group chats.
- **Automated Event Channels**: Every event automatically triggers a **Discussion Feed** for attendees and an **Announcements Channel** for organizers.

### 4. Visual Intelligence Dashboard
- **Interest Radar**: Visualizes how your profile aligns with current campus offerings.
- **Trending Graph**: Dynamic bar charts showing registration peaks and hot categories.

### 5. Seamless Event Management
- **Dual-Mode Banner**: Support for external URLs or secure ImageKit cloud uploads.
- **Attendee Control**: Comprehensive tools for organizers to manage, remove, or blacklist attendees.

## 🛡️ Security & Architecture
- **Dual-Token Auth**: High-security Access (Memory) and Refresh (HttpOnly Cookie) token architecture.
- **Serverless Ready**: Optimized for Vercel with a decoupled API/Static architecture.
- **Real-Time Guard**: Socket.io middleware for secure personal and group room joining.