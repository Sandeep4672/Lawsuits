import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 300,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    partiesInvolved: [{
      type: String,
      trim: true,
    }],
    caseNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    caseType: {
      type: String,
      index: true,
    },
    court: {
      type: String,
      index: true,
    },
    dateOfJudgment: {
      type: Date,
      index: true,
    },
    tags: {
      type: [String],
      set: (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(t => t.toLowerCase().trim());
      },
      index: true
    }
    ,
    cloudinary: {
      public_id: String,
      secure_url: String,
      original_filename: String,
      format: String,
      bytes: Number,
    },
    contentText: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

pdfSchema.index({
  title: "text",
  description: "text",
  summary: "text",
  contentText: "text",
  tags: "text",
});

pdfSchema.virtual("fileSizeMB").get(function () {
  return (this.cloudinary?.bytes || 0) / (1024 * 1024);
});

export const PdfDocument = mongoose.model("PdfDocument", pdfSchema);
