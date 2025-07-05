import { LawyerProfile } from "../models/lawyerProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getLawyerProfileById = asyncHandler(async (req, res) => {
  const lawyerId = req.params.lawyerId || req.user?._id;
    console.log(lawyerId);
  if (!lawyerId) {
    return res.status(400).json(new ApiResponse(400, null, "Lawyer ID is required"));
  }

  const profile = await LawyerProfile.findOne({ lawyer: lawyerId })
    .populate("lawyer", "fullName email");

  if (!profile) {
    return res.status(404).json(new ApiResponse(404, null, "Lawyer profile not found"));
  }

  res.status(200).json(new ApiResponse(200, profile, "Lawyer profile fetched successfully"));
});


import { uploadFileToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const updateLawyerProfile = asyncHandler(async (req, res) => {
  const lawyerId = req.user._id; 

  const updateData = { ...req.body, updatedAt: new Date() };

  if (req.file) {
    const localPath = req.file.path;
    console.log(localPath);
    try {
      const result = await uploadFileToCloudinary(localPath, "Lawsuits/LawyerProfilePictures");
      updateData.profilePicture = result.secure_url;

      fs.existsSync(localPath) && fs.unlinkSync(localPath);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      fs.existsSync(localPath) && fs.unlinkSync(localPath);
      return res.status(500).json(new ApiResponse(500, null, "Failed to upload profile picture"));
    }
  }

  const updatedProfile = await LawyerProfile.findOneAndUpdate(
    { lawyer: lawyerId },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, updatedProfile, "Lawyer profile updated successfully")
  );
});

