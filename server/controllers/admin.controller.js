import fs from "fs";
import pdf from "pdf-parse";
import { uploadFileToCloudinary,deleteFileFromCloudinary } from "../utils/cloudinary.js";
import { PdfDocument } from "../models/pdf.model.js";
import { summarizePdfFile } from "./user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { extractLegalTerms } from "../utils/extractLegalTerms.js";
import { LawyerRequest } from "../models/lawyerRequest.model.js";
import { Lawyer } from "../models/lawyer.model.js";
import { sendEmail } from "../utils/emailService.js";

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



export const getAllLawyersRequest = asyncHandler(async (req, res) => {
  try {
    const lawyerRequests = await LawyerRequest.find().select("-password");
    console.log("Lawyers Requests:", lawyerRequests);

    res.status(200).json({
      success: true,
      data: lawyerRequests,
    });
  } catch (error) {
    console.error("Error fetching lawyer requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lawyer requests",
    });
  }
});


export const getLawyerRequestById = async (req, res, next) => {
  try {
    const requestId = req.params.id;

    const request = await LawyerRequest.findById(requestId).select("-password"); // exclude password

    if (!request) {
      return res.status(404).json({ message: "Lawyer request not found" });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptLawyerRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;

  const lawyerRequest = await LawyerRequest.findById(requestId).select("-refreshToken"); 
  if (!lawyerRequest) throw new ApiError(404, "Lawyer request not found");

  const lawyer = new Lawyer({
    fullName: lawyerRequest.fullName,
    email: lawyerRequest.email,
    password: lawyerRequest.password,
    phone: lawyerRequest.phone,
    barId: lawyerRequest.barId,
    practiceAreas: lawyerRequest.practiceAreas,
    experience: lawyerRequest.experience,
    sop: lawyerRequest.sop,
    proofFile: lawyerRequest.proofFile,
  });

  await lawyer.save();
  await lawyerRequest.deleteOne();

  await sendEmail({
    to: lawyer.email,
    subject: "Your Lawyer Application has been Approved",
    html: `
      <h3>Congratulations ${lawyer.fullName},</h3>
      <p>Your application to join Lawsuits as a verified lawyer has been accepted!</p>
      <p>You can now log in to your account and start offering legal services.</p>
      <br/>
      <p>Regards,<br/>Lawsuits Team</p>
    `
  });

  res.status(200).json({
    success: true,
    message: "Lawyer request accepted and email sent",
    data: lawyer,
  });
});

export const declineLawyerRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const { message } = req.body; 

  const request = await LawyerRequest.findById(requestId);
  if (!request) throw new ApiError(404, "Lawyer request not found");

  await LawyerRequest.findByIdAndDelete(requestId);

  await sendEmail({
    to: request.email,
    subject: "Your Lawyer Application has been Rejected",
    html: `
      <h3>Dear ${request.fullName},</h3>
      <p>We regret to inform you that your lawyer verification request has been rejected.</p>
      <p><strong>Reason:</strong> ${message || "Not specified by admin."}</p>
      <p>You may re-apply with corrected or additional documents in the future.</p>
      <br/>
      <p>Regards,<br/>Lawsuits Team</p>
    `
  });

  res.status(200).json({
    success: true,
    message: "Lawyer request declined and email sent",
  });
});


export const getLawyerById = asyncHandler(async (req, res) => {
  const lawyerId = req.user._id;

  try {
    const lawyer = await Lawyer.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lawyer,
    });
  } catch (error) {
    console.error("Error fetching lawyer profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch lawyer profile",
      error: error.message,
    });
  }
});


export const getCaseFiles=asyncHandler(async(req,res)=>{
    try{
      const casefiles=await PdfDocument.find();
      res.status(200).json(new ApiResponse(200,casefiles,"Successfully Retrieved Case Files"));
    }catch(error){
        res.status(500).json(new ApiResponse(500,error,"Failed to retrieve documents"));
    }
})


export const getCaseFileById=asyncHandler(async(req,res)=>{
    try {
      const caseId=req.params.caseId;
      const existingCase= await PdfDocument.findById(caseId);
      if(!existingCase){
        return res.status(404).json(new ApiResponse(404,null,"No exisiting Case "));
      }

      return res.status(200).json(new ApiResponse(200,existingCase,"Successfully fetched"));
      
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,error,"Internal server error"));

    }
})


export const updateCaseFileById = asyncHandler(async (req, res) => {
  try {
    const caseId = req.params.caseId;

    const existingCase = await PdfDocument.findById(caseId);
    if (!existingCase) {
      return res.status(404).json({ message: "Case not found." });
    }

    const {
      title,
      description,
      summary,
      partiesInvolved,
      caseNumber,
      caseType,
      court,
      dateOfJudgment,
      tags,
      contentText,
    } = req.body;
    console.log(req.body);
    if (title) existingCase.title = title;
    if (description) existingCase.description = description;
    if (summary) existingCase.summary = summary;
    if (partiesInvolved) existingCase.partiesInvolved = partiesInvolved;
    if (caseNumber) existingCase.caseNumber = caseNumber;
    if (caseType) existingCase.caseType = caseType;
    if (court) existingCase.court = court;
    if (dateOfJudgment) existingCase.dateOfJudgment = new Date(dateOfJudgment);
    if (tags) existingCase.tags = tags;
    if (contentText) existingCase.contentText = contentText;

    if (req.file) {
      if (existingCase.cloudinary?.public_id) {
        await deleteFileFromCloudinary(existingCase.cloudinary.public_id);
      }

      const cloudinaryResult = await uploadFileToCloudinary(req.file.path, "Lawsuits/CaseFiles");

      existingCase.cloudinary = {
        public_id: cloudinaryResult.public_id,
        secure_url: cloudinaryResult.secure_url,
        original_filename: cloudinaryResult.original_filename,
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes,
      };
    }

    await existingCase.save();

    res.status(200).json({
      message: "Case file updated successfully",
      data: existingCase,
    });
  } catch (error) {
    console.error("Update Case File Error:", error);
    res.status(500).json({
      message: "Failed to update case file",
      error: error.message,
    });
  }
});

