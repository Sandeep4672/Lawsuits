import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number], 
      required: true,
    },
    summary: {
      type: String,
    },
  },
  { timestamps: true }
);

export const PdfDocument = mongoose.model("PdfDocument", pdfSchema);
