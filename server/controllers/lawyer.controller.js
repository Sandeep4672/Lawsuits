import { LawyerRequest } from "../models/lawyerRequest.model.js";
import { Lawyer } from "../models/lawyer.model.js";
import { uploadPdfToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import fs from "fs";

export const signupLawyer = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      barId,
      practiceAreas,
      experience,
      sop,
      password
    } = req.body;


    const existingLawyer = await Lawyer.findOne({ email });
    if (existingLawyer) {
      return res.status(400).json({ message: "Already a verified lawyer" });
    }

    const existingRequest = await LawyerRequest.findOne({ email });
    if (existingRequest) {
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
    } catch {
      parsedPracticeAreas = [practiceAreas];
    }

    const lawyerRequest = new LawyerRequest({
      fullName,
      email,
      password, 
      phone,
      barId,
      practiceAreas: parsedPracticeAreas,
      experience,
      sop,
      proofFile: proofUrls,
    });

    await lawyerRequest.save();

    return res.status(201).json({
      message: "Lawyer request submitted successfully",
      lawyerRequest,
    });
  } catch (error) {
    next(error);
  }
};

const loginLawyer = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const lawyer = await Lawyer.findOne({ email });
    if (!lawyer) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await lawyer.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const accessToken = await lawyer.generateAccessToken();
    const refreshToken = await lawyer.generateRefreshToken();

    user.refreshToken = refreshToken;
    await lawyer.save({ validateBeforeSave: false });

    const cookieOptions = {
        httpOnly: true,
        secure: true, 
        sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    const lawyerData = await Lawyer.findById(lawyer._id).select("-password -refreshToken");
    console.log("userdata-",lawyerData);
    return res.status(200).json(
        
        new ApiResponse(200, { user: lawyerData, accessToken }, "Login successful")
    );
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



export const getAllLawyersList = asyncHandler(async (req, res) => {
  try {
    const lawyers = await Lawyer.find().select("-password -refreshToken");
    console.log("Verified Lawyers:", lawyers);

    res.status(200).json({
      success: true,
      data: lawyers,
    });
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lawyers",
    });
  }
});



export const acceptLawyerRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;

  const lawyerRequest = await LawyerRequest.findById(requestId).select("-refreshToken"); 
  if (!lawyerRequest) {
    throw new ApiError(404, "Lawyer request not found");
  }

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

  res.status(200).json({
    success: true,
    message: "Lawyer request accepted and verified lawyer created",
    data: lawyer,
  });
});


export const declineLawyerRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;

  const request = await LawyerRequest.findById(requestId);
  if (!request) {
    throw new ApiError(404, "Lawyer request not found");
  }

  await LawyerRequest.findByIdAndDelete(requestId);

  res.status(200).json({
    success: true,
    message: "Lawyer request rejected and removed",
  });
});

export const getLawyerById = asyncHandler(async (req, res) => {
  const lawyerId = req.params.id;

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