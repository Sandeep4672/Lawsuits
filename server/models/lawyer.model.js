import mongoose, { Schema } from "mongoose";

const lawyerProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: [String],
      required: true,
    },
    experienceYears: {
      type: Number,
      required: true,
    },
    barCouncilId: {
      type: String,
      required: true,
      unique: true,
    },
    certificates: [String], 
    bio: String,
    availableForChat: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const LawyerProfile = mongoose.model("LawyerProfile", lawyerProfileSchema);
