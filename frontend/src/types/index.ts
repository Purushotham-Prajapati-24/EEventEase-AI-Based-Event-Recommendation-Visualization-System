export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "organizer";
  profileImage?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  followers: (string | User)[];
  following: (string | User)[];
  createdAt: string;
  roleMetadata?: {
    totalAttended?: number;
    averageRating?: number;
    totalOrganized?: number;
  };
  organizedEvents?: EventData[];
  registeredEvents?: EventData[];
}


export interface EventData {
  blacklistedUsers: any[];
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  club: string;
  posterUrl?: string;
  capacity: number;
  interests: string[];
  registeredAttendees: (User | string)[];
  organizer: string | User;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  discussionChat?: string;
  announcementChat?: string;
}


