# 3. User Workflow & Journey Mapping

## 🧑‍🎓 Student Persona (Primary User)

### 📍 Phase 1: High-Fidelity Onboarding
1. **Registration**: User creates an account with email/password.
2. **Interest Selection**: Immediate redirect to a specialized UI to select 3+ interests (e.g., Coding, Music, Finance).
3. **Identity Setup**: Uploads a profile image (via ImageKit) and writes a short bio to establish campus presence.
4. **Landing**: Arrives at the dashboard with pre-calculated AI spotlights.

### 📍 Phase 2: AI-Driven Discovery
1. **Dashboard Insights**: Views the **Interest Radar** showing their alignment with current events.
2. **Exploration**: Browses the **Discovery** page with events sorted by relevance.
3. **Trust Building**: Reads the AI-generated "Reason for Recommendation" to understand the match.

### 📍 Phase 3: Social & Community Engagement
1. **Networking**: Uses the **"People You May Know"** sidebar to find students with matching interests.
2. **Following**: Follows peers or organizers to stay updated on their activities.
3. **Chatting**: Initiates direct messages with peers or joins the **Event Discussion Chat** after registration.

### 📍 Phase 4: Event Commitment
1. **Registration**: Clicks "Secure My Spot" for an upcoming workshop.
2. **Updates**: Monitors the **Announcements** channel for real-time changes from the organizer.
3. **Visual Feedback**: Sees the registration count rise, reflecting event popularity.

---

## 🧑‍💼 Organizer Persona (Power User)

### 📍 Phase 1: Event Architecture
1. **Creation**: Fills out the `EventForm` with title, date, and description.
2. **Banner Management**: Chooses between "Upload Image" (stored on cloud) or "Use URL" for the event poster.
3. **Automatic Deployment**: Upon saving, the system automatically creates:
   - A public event page.
   - A **Discussion Chat** for student networking.
   - An **Announcement Chat** for high-priority updates.

### 📍 Phase 2: Management & Moderation
1. **Dashboard**: Monitors registration counts and attendee lists.
2. **Moderation**: Uses the **Attendee Manager** to remove or blacklist users if necessary.
3. **Communication**: Posts high-priority updates in the Announcement channel, which triggers real-time UI notifications for attendees.