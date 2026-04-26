import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  date: Date;
  location: string;
  tags: string[];
  club: string;
  capacity: number;
  registeredAttendees: mongoose.Types.ObjectId[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  posterUrl?: string;
  blacklistedUsers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    tags: [{ type: String }],
    club: { type: String, required: true },
    capacity: { type: Number, required: true },
    registeredAttendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    posterUrl: { type: String },
    blacklistedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    discussionChat: { type: Schema.Types.ObjectId, ref: "Chat" },
    announcementChat: { type: Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

// Indexing for search performance
EventSchema.index({ tags: 1 });
EventSchema.index({ date: 1 });
EventSchema.index({ status: 1 });

export default mongoose.model<IEvent>("Event", EventSchema);
