import mongoose, { Schema } from "mongoose";

const lawyerProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullLawyerName: {
      type: String,
      required: true,
      trim: true,
    },
    professionalEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
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
    sop: {
      type: String,
    },
    proofFile: {
  type: [String], 
  required: true,
}
,
  },
  { timestamps: true }
);

export const LawyerProfile = mongoose.model("LawyerProfile", lawyerProfileSchema);
