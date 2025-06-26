import mongoose, { Schema } from "mongoose";

const ConnectionRequestSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
  subject: { type: String, required: true },
  message: { type: String },
  documents: [{
    public_id: String,
    secure_url: String,
    original_filename: String,
  }],
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const ConnectionRequest = mongoose.model("ConnectionRequests", ConnectionRequestSchema);

