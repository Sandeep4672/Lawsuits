import mongoose, { Schema } from "mongoose";

const lawyerRequestSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email"],

    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit phone number"],

    },
    barId: {
      type: String,
      required: true,
      unique: true,
    },
    practiceAreas: {
      type: [String],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    rsaPublicKey:           { type: String, required: true },
  encryptedPrivateKey: { type: String, required: true },
salt: { type: String, required: true },
iv: { type: String, required: true },
 
    sop: {
      type: String,
    },
    proofFile: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const LawyerRequest = mongoose.model("LawyerRequest", lawyerRequestSchema);
