import mongoose, { Schema } from "mongoose";

const chatThreadSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
  caseRequest: { type: mongoose.Schema.Types.ObjectId, ref: "ConnectionRequest", required: true },
  createdAt: { type: Date, default: Date.now },
});


export const ChatThread = mongoose.model("ChatThread", chatThreadSchema);
