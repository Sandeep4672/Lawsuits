import fs from "fs";
import pdf from "pdf-parse";
import { callOpenRouter } from "../utils/openAIRouter.js";
import { extractLegalTerms } from "../utils/extractLegalTerms.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ConnectionRequest } from "../models/connectionRequest.model.js";
import { Lawyer } from "../models/lawyer.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadFileToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";




export const summarizePdfFile = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  const fullText = pdfData.text;

  const textToSummarize = fullText.slice(0, 4000);
  const summary = await callOpenRouter(textToSummarize);

  const legalTerms = extractLegalTerms(fullText);

  return { summary, legalTerms };
};

export const summarizePDF = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const { summary, legalTerms } = await summarizePdfFile(file.path);
    fs.unlinkSync(file.path);

    res.json({ summary, legalTerms });
  } catch (error) {
    console.error("Error in summarizePDF:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});


export const sendConnectionRequest = asyncHandler(async (req, res) => {
  const lawyerId = req.params.id;
  const clientId = req.user._id;

  const { subject, message } = req.body;
  const files = req.files || [];

  if (!subject || subject.trim().length < 5) {
    throw new ApiError(400, "Subject is required and must be at least 5 characters");
  }

  const lawyer = await Lawyer.findById(lawyerId);
  if (!lawyer) {
    throw new ApiError(404, "Lawyer not found");
  }

  const existing = await ConnectionRequest.findOne({
    client: clientId,
    lawyer: lawyerId,
  });

  if (existing) {
    throw new ApiError(409, "You already have an existing connection request");
  }

  const uploadedDocs = [];
  const uploadedPublicIds = [];

  try {
    for (const file of files) {
      const uploaded = await uploadFileToCloudinary(file.path, "LawSuits/ThreadFiles");
      uploadedDocs.push({
        public_id: uploaded.public_id,
        secure_url: uploaded.secure_url,
        original_filename: uploaded.original_filename,
      });
      uploadedPublicIds.push(uploaded.public_id);
    }

    const newRequest = await ConnectionRequest.create({
      client: clientId,
      lawyer: lawyerId,
      subject,
      message,
      documents: uploadedDocs,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newRequest, "Connection request sent successfully"));
  } catch (error) {
    for (const publicId of uploadedPublicIds) {
      try {
        await deleteFileFromCloudinary(publicId);
      } catch (cleanupErr) {
        console.error("Cloudinary cleanup failed:", cleanupErr.message);
      }
    }

    throw error; 
  } finally {
    for (const file of files) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
});


export const getAllConnectedLawyers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const connections = await ConnectionRequest.find({
    user: userId,
    status: "accepted",
  }).populate({
    path: "lawyer",
    select: "fullLawyerName professionalEmail",
    populate: {
      path: "user",
      select: "email",
    },
  });

  res.status(200).json(connections);
});


export const getUserHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const history = await User.findById(userId)
      .select("recentCases")
      .populate("recentCases.caseId", "title"); 

    res.status(200).json(
      new ApiResponse(200, history?.recentCases || [], "Recent case history fetched")
    );
  } catch (error) {
    console.error("Error fetching history:", error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch user history"));
  }
});


export const deleteUserHistoryById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const caseId = req.params.caseId;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          recentCases: { caseId: new mongoose.Types.ObjectId(caseId) },
        },
      },
      { new: true }
    );

    res.status(200).json(
      new ApiResponse(200, user.recentCases, "Case removed from history")
    );
  } catch (error) {
    console.error("Error deleting history", error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Error deleting user history"));
  }
});

export const clearUserHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { recentCases: [] } }, 
      { new: true }
    );

    res.status(200).json(
      new ApiResponse(200, user.recentCases, "All case history cleared")
    );
  } catch (error) {
    console.error("Error clearing history", error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to clear user history"));
  }
});

export const saveCase = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { caseId } = req.body;

  if (!caseId) {
    return res.status(400).json(new ApiResponse(400, null, "caseId is required"));
  }

  try {
    const user = await User.findById(userId);

    const alreadySaved = user.savedCases.some(
      (entry) => entry.caseId.toString() === caseId
    );

    if (alreadySaved) {
      return res.status(200).json(
        new ApiResponse(200, user.savedCases, "Case already saved")
      );
    }

    if (user.savedCases.length >= 10) {
      return res.status(400).json(
        new ApiResponse(400, null, "You can only save up to 10 cases. Please remove one to save a new case.")
      );
    }

    user.savedCases.unshift({
      caseId,
      savedAt: new Date(),
    });

    await user.save();

    res.status(200).json(
      new ApiResponse(200, user.savedCases, "Case saved successfully")
    );
  } catch (error) {
    console.error("Error saving case:", error);
    res.status(500).json(
      new ApiResponse(500, null, "Failed to save case")
    );
  }
});


export const getUserSavedCases = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId)
      .select("savedCases")
      .populate("savedCases.caseId", "title caseType dateOfJudgment court");

    res.status(200).json(
      new ApiResponse(200, user?.savedCases || [], "Saved cases fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching saved cases:", error);
    res.status(500).json(new ApiResponse(500, null, "Failed to fetch saved cases"));
  }
});

export const deleteUserSavedCaseById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const caseId = req.params.caseId;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          savedCases: { caseId: new mongoose.Types.ObjectId(caseId) },
        },
      },
      { new: true }
    );

    res.status(200).json(
      new ApiResponse(200, user.savedCases, "Case removed from saved list")
    );
  } catch (error) {
    console.error("Error deleting saved case:", error);
    res.status(500).json(new ApiResponse(500, null, "Failed to delete saved case"));
  }
});

export const clearUserSavedCases = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { savedCases: [] } },
      { new: true }
    );

    res.status(200).json(
      new ApiResponse(200, user.savedCases, "All saved cases cleared")
    );
  } catch (error) {
    console.error("Error clearing saved cases:", error);
    res.status(500).json(new ApiResponse(500, null, "Failed to clear saved cases"));
  }
});

