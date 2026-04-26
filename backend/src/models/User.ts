import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "student" | "organizer" | "admin";
  interests: string[];
  registeredEvents: mongoose.Types.ObjectId[];
  profileImage: string;
  bio: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "organizer", "admin"],
      default: "student",
    },
    interests: [{ type: String }],
    registeredEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    profileImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    roleMetadata: {
      totalAttended: { type: Number, default: 0 },
      totalOrganized: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for events organized by this user
UserSchema.virtual("organizedEvents", {
  ref: "Event",
  localField: "_id",
  foreignField: "organizer",
});

export default mongoose.model<IUser>("User", UserSchema);
