import { BrowserRouter, Routes, Route } from "react-router-dom"
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";
import { Navbar } from "./components/layout/Navbar"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Discovery } from "./pages/Discovery"
import { EventDetails } from "./pages/EventDetails"
import { Dashboard } from "./pages/Dashboard"
import { OrganizerDashboard } from "./pages/OrganizerDashboard"
import Profile from "./pages/Profile"
import Chat from "./pages/Chat"
import { NotFound } from "./pages/NotFound"
import Onboarding from "./pages/Onboarding"

gsap.registerPlugin(ScrollTrigger);

// Layouts
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Global stagger-in for all cards and glass elements
    gsap.from(".glass, .card", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: ".glass, .card",
        start: "top 90%",
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};


// Placeholders for Organizer/Admin Pages
const OrganizerAnalytics = () => <div className="p-8">Organizer Analytics</div>
const AIInsights = () => <div className="p-8">AI Insights Dashboard</div>

import { checkAuth, setInitialized } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Proactively refresh token if user exists in local storage
    if (localStorage.getItem("user")) {
      dispatch(checkAuth());
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />
          <Route path="/admin/insights" element={<AIInsights />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  )
}

export default App
