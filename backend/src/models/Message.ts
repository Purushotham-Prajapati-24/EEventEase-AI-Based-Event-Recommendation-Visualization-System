import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  readBy: {
    user: mongoose.Types.ObjectId;
    readAt: Date;
  }[];
  attachments?: string[];
  createdAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    readBy: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date, default: Date.now },
      },
    ],
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
