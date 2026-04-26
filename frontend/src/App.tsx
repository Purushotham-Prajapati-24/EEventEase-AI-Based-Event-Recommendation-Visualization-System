import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import { Navbar } from "./components/layout/Navbar"

// Layouts
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

// Placeholders for Pages
const Discovery = () => <div className="p-8">Discovery Page</div>
const EventDetails = () => <div className="p-8">Event Details Page</div>
const Dashboard = () => <div className="p-8">Student Dashboard</div>
const OrganizerView = () => <div className="p-8">Organizer View</div>
const OrganizerAnalytics = () => <div className="p-8">Organizer Analytics</div>
const AIInsights = () => <div className="p-8">AI Insights Dashboard</div>

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/discovery" replace />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organizer" element={<OrganizerView />} />
          <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />
          <Route path="/admin/insights" element={<AIInsights />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  )
}

export default App
