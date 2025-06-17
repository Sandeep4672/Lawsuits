import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    partiesInvolved: [String], // e.g., ["State", "John Doe"]

    caseNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },

    caseType: {
      type: String, // e.g., "Criminal", "Civil", "Murder", "Fraud"
      index: true
    },

    court: {
      type: String, // e.g., "Supreme Court", "Delhi High Court"
      index: true
    },

    dateOfJudgment: {
      type: Date,
      index: true
    },

    tags: [{
      type: String,
      lowercase: true,
      index: true
    }], // e.g., ["murder", "ipc 302", "section 420"]

    cloudinary: {
      public_id: String,
      secure_url: String,
      original_filename: String,
      format: String,
      bytes: Number
    },

    contentText: {
      type: String,
      select: false 
    },
  },
  { timestamps: true }
);

// 🔍 Full-text index for smart searching
pdfSchema.index({ title: "text", description: "text", contentText: "text", tags: "text" });

export const PdfDocument = mongoose.model("PdfDocument", pdfSchema);
