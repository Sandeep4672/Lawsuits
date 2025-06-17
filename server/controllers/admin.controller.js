import fs from "fs";
import pdf from "pdf-parse";
import { uploadPdfToCloudinary } from "../utils/cloudinary.js";
import { PdfDocument } from "../models/pdf.model.js";
import { callEmbeddingAPI } from "../utils/embedding.js";
import { summarizePdfFile } from "./summarize.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const uploadPdfToDatabase = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw new ApiError(400, "PDF file is required");

  const title = req.body.title || file.originalname;
  const filePath = file.path;

  // 1. Extract PDF text (limited to 4000 chars for embedding)
  const dataBuffer = fs.readFileSync(filePath);
  const parsed = await pdf(dataBuffer);
  const text = parsed.text?.slice(0, 4000) || "";

  // 2. Get summary and embedding
  const summary = await summarizePdfFile(filePath);
  const embedding = await callEmbeddingAPI(text);

  // 3. Upload file to Cloudinary
  const cloudinaryResult = await uploadPdfToCloudinary(filePath);
  fs.unlinkSync(filePath); // Clean up local file

  // 4. Save to MongoDB
  const doc = await PdfDocument.create({
    title,
    pdfUrl: cloudinaryResult.secure_url,
    cloudinaryPublicId: cloudinaryResult.public_id,
    embedding,
    summary,
  });

  res.status(201).json(new ApiResponse(201, doc, "PDF uploaded successfully"));
});
