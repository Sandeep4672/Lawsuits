import { LawyerRequest } from "../models/lawyerRequest.model.js";
import { Lawyer } from "../models/lawyer.model.js";
import { uploadPdfToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
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

export const loginLawyer = asyncHandler(async (req, res) => {
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

    lawyer.refreshToken = refreshToken;
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


export const logoutLawyer = asyncHandler(async (req, res) => {
    // Remove the refresh token from DB
    await Lawyer.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    // Clear cookies
    const options = {
        httpOnly: true,
        secure: true,     
        sameSite: "strict"
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res.status(200).json(
        new ApiResponse(200, null, "User logged out successfully")
    );
});