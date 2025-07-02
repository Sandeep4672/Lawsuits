import fs from "fs";
import pdf from "pdf-parse";
import { uploadFileToCloudinary,deleteFileFromCloudinary } from "../utils/cloudinary.js";
import { PdfDocument } from "../models/pdf.model.js";
import { summarizePdfFile } from "./home.controller.js";
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
  let cloudinaryResult = null;

  try {
    // 1. Extract text from PDF
    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdf(dataBuffer);
    const text = parsed.text || "";

    // 2. Optional: Get AI summary
    const summaryData = await summarizePdfFile(filePath);
    const summary = summaryData.summary;

    // 3. Extract tags
    const tags = extractLegalTerms(text);

    // 4. Upload to Cloudinary
    cloudinaryResult = await uploadFileToCloudinary(filePath, "LawSuits/CaseFiles");

    // 5. Save to MongoDB
    const doc = await PdfDocument.create({
      title: title || file.originalname,
      caseNumber,
      caseType,
      court,
      dateOfJudgment: dateOfJudgment ? new Date(dateOfJudgment) : undefined,
      tags: typeof tags === "string" ? tags.split(",").map(tag => tag.trim().toLowerCase()) : tags,
      contentText: text,
      summary,
      partiesInvolved: typeof partiesInvolved === "string"
        ? partiesInvolved.split(",").map(party => party.trim())
        : partiesInvolved,
      cloudinary: {
        public_id: cloudinaryResult.public_id,
        secure_url: cloudinaryResult.secure_url,
        original_filename: cloudinaryResult.original_filename,
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes
      },
    });

    res.status(201).json(new ApiResponse(201, doc, "PDF uploaded successfully"));
  } catch (error) {
    if (cloudinaryResult?.public_id) {
      try {
        await deleteFileFromCloudinary(cloudinaryResult.public_id);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed:", cleanupError.message);
      }
    }

    throw error; 
  } finally {
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
  }
});
