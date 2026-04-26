export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "organizer";
  profileImage?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  followers: string[];
  following: string[];
  organizedEvents?: EventData[];
  registeredEvents?: EventData[];
}

export interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  posterUrl?: string;
  capacity: number;
  registeredAttendees: string[];
  organizer: string | User;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  tags: string[];
}
