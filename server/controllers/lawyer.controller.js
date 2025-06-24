import { User } from "../models/user.model.js";
import { LawyerProfile } from "../models/lawyer.model.js";
import { uploadPdfToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import fs from "fs";

export const applyAsLawyer = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      fullLawyerName,
      professionalEmail,
      phone,
      barId,
      practiceAreas,
      experience,
      sop,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isLawyer === "yes") {
      return res.status(400).json({ message: "Already a verified lawyer" });
    }

    if (user.isLawyer === "pending") {
      return res.status(400).json({ message: "Application already pending" });
    }

    const proofUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadPdfToCloudinary(file.path, "lawyers/proof");
        proofUrls.push(result.secure_url);

        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path); 
        }
      }
    } else {
      return res.status(400).json({ message: "At least one proof file is required" });
    }

    let parsedPracticeAreas = [];

    try {
      if (typeof practiceAreas === "string") {
        parsedPracticeAreas = JSON.parse(practiceAreas);
      } else if (Array.isArray(practiceAreas)) {
        parsedPracticeAreas = practiceAreas;
      }
    } catch (err) {
      parsedPracticeAreas = [practiceAreas];
    }

    const lawyerProfile = new LawyerProfile({
      user: user._id,
      fullLawyerName,
      professionalEmail,
      phone,
      barId,
      practiceAreas: parsedPracticeAreas,
      experience,
      sop,
      proofFile: proofUrls,
      isLawyer: "pending",
    });

    await lawyerProfile.save();

    user.isLawyer = "pending";
    await user.save();

    return res.status(201).json({
      message: "Lawyer application submitted successfully",
      lawyerProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const getLawyerProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("fullName email isLawyer");

    if (!user || user.isLawyer !== "yes") {
      return res.status(404).json({ message: "Verified lawyer not found" });
    }

    const profile = await LawyerProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }

    return res.status(200).json({
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingLawyers = async (req, res, next) => {
  try {
    const pendingUsers = await User.find({ isLawyer: "pending" }).select("_id");

    const userIds = pendingUsers.map((u) => u._id);

    const lawyerProfiles = await LawyerProfile.find({ user: { $in: userIds } })
      .populate("user", "fullName email phone isLawyer") 
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Pending lawyers fetched successfully",
      lawyerProfiles,
    });
  } catch (error) {
    next(error);
  }
};


export const getLawyerRequestById = async (req, res, next) => {
  try {
    const lawyerProfileId = req.params.id;

    const profile = await LawyerProfile.findById(lawyerProfileId);

    if (!profile) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }
  
    return res.status(200).json({
      profile,
    });
  } catch (error) {
    next(error);
  }
};



export const getAllLawyersList=asyncHandler(async (req, res) => {
  try {
    const lawyerProfiles = await LawyerProfile.find({ isLawyer:"yes" });
    console.log("User Lawyers:", lawyerProfiles);
  
    res.status(200).json({
      success: true,
      data: lawyerProfiles
    });
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lawyers"
    });
  }
}) ;



export const acceptLawyerRequest = asyncHandler(async (req, res) => {
  const lawyerProfileId = req.params.id;

  const userIdObject = await LawyerProfile.findById(lawyerProfileId).select('user');
  const userId=userIdObject.user;
  if (!userId) {
    throw new ApiError(404, "Lawyer profile not found");
  }
  console.log("UserId",userId);
  const user=await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isLawyer = "yes";
  await user.save();

  res.status(200).json({
    success: true,
    message: "Lawyer request accepted",
  });
});

export const declineLawyerRequest = asyncHandler(async (req, res) => {
  const lawyerProfileId = req.params.id;

  const userIdObject = await LawyerProfile.findById(lawyerProfileId).select('user');
  const userId=userIdObject.user;
  if (!userId) {
    throw new ApiError(404, "Lawyer profile not found");
  }
  await LawyerProfile.deleteOne({user:userId});
  const user=await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isLawyer = "no";
  await user.save();

  res.status(200).json({
    success: true,
    message: "Lawyer request rejected",
  });
});

export const getLawyerProfileById = asyncHandler(async (req, res) => {
  const lawyerId = req.params.id;

  try {
    const lawyerProfile = await LawyerProfile.findOne({ _id: lawyerId });

    if (!lawyerProfile) {
      return res.status(404).json({
        success: false,
        message: "Lawyer profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lawyerProfile,
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