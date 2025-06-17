import fs from "fs";
import pdf from "pdf-parse";
import { uploadPdfToCloudinary } from "../utils/cloudinary.js";
import { PdfDocument } from "../models/pdf.model.js";
import { summarizePdfFile } from "./summarize.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { extractLegalTerms } from "../utils/extractLegalTerms.js";

export const uploadPdfToDatabase = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw new ApiError(400, "PDF file is required");

  const {
    title,
    caseNumber,
    caseType,
    court,
    dateOfJudgment,
    partiesInvolved = [],
  } = req.body;

  const filePath = file.path;

  // 1. Extract full PDF text
  const dataBuffer = fs.readFileSync(filePath);
  const parsed = await pdf(dataBuffer);
  const text = parsed.text || "";

  // 2. Get AI summary (optional but helpful)
  const summary = await summarizePdfFile(filePath);
  const tags = extractLegalTerms(text);
  // 3. Upload to Cloudinary
  const cloudinaryResult = await uploadPdfToCloudinary(filePath);
  
  // 4. Save to MongoDB
  const doc = await PdfDocument.create({
    title: title || file.originalname,
    caseNumber,
    caseType,
    court,
    dateOfJudgment: dateOfJudgment ? new Date(dateOfJudgment) : undefined,
    tags: typeof tags === "string" ? tags.split(",").map(tag => tag.trim().toLowerCase()) : tags,
    contentText: text,
    summary,
    partiesInvolved: typeof partiesInvolved === "string" ? partiesInvolved.split(",").map(party => party.trim()) : partiesInvolved,
    cloudinary: {
      public_id: cloudinaryResult.public_id,
      secure_url: cloudinaryResult.secure_url,
      original_filename: cloudinaryResult.original_filename,
      format: cloudinaryResult.format,
      bytes: cloudinaryResult.bytes
    },
   
  });

  res.status(201).json(new ApiResponse(201, doc, "PDF uploaded successfully"));
});
