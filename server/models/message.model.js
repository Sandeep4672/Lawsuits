import mongoose, { Schema } from "mongoose";


const messageSchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: "ChatThread", required: true },
  senderType: { type: String, enum: ["client", "lawyer"], required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true }, // can be user or lawyer
  message: { type: String },
  attachment: {
    public_id: String,
    secure_url: String,
    original_filename: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", messageSchema);

