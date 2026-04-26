import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  date: Date;
  location: string;
  tags: string[];
  capacity: number;
  registeredAttendees: mongoose.Types.ObjectId[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
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
    capacity: { type: Number, required: true },
    registeredAttendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

// Indexing for search performance
EventSchema.index({ tags: 1 });
EventSchema.index({ date: 1 });
EventSchema.index({ status: 1 });

export default mongoose.model<IEvent>("Event", EventSchema);
