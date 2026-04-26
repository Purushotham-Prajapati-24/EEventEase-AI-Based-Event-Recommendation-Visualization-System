import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  isGroupChat: boolean;
  groupName?: string;
  groupAdmin?: mongoose.Types.ObjectId;
  lastMessage?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isGroupChat: { type: Boolean, default: false },
    groupName: { type: String },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export default mongoose.model<IChat>("Chat", ChatSchema);
