import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import otpStore from "../utils/otpStore.js";
import { sendEmail } from "../utils/emailService.js";
import {ApiError} from "../utils/apiError.js";



const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  console.log(email);
  const otp = Math.floor(100000 + Math.random() * 900000);
  const ttlSeconds = 5 * 60; // 5 minutes

  await otpStore.set(`otp:${email}`, otp, "EX", ttlSeconds);

await sendEmail({
  to: email,
  subject: "Your OTP Code",
  html: `Your OTP is: ${otp}`,
});

  res.status(200).json({ message: "OTP sent to email" });
});



export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const storedOtp = await otpStore.get(`otp:${email}`);
  if (!storedOtp) {
    throw new ApiError(400, "OTP expired or not found. Please request a new one.");
  }

  if (storedOtp !== otp.toString()) {
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  await otpStore.set(`otp:verified:${email}`, "true", "EX", 300); // mark verified for 5 min
  await otpStore.del(`otp:${email}`); // delete OTP after use

  res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
});

const signupUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    rsaPublicKey,
    encryptedPrivateKey,
    salt,
    iv,
  } = req.body;

  if (
    [fullName, email, password, rsaPublicKey, encryptedPrivateKey, salt, iv].some(
      (f) => !f?.toString().trim()
    )
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const isVerified = await otpStore.get(`otp:verified:${email}`);
  if (!isVerified) {
    throw new ApiError(400, "OTP not verified or expired");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    rsaPublicKey,
    encryptedPrivateKey,
    salt,
    iv,
  });

  await otpStore.del(`otp:verified:${email}`); // remove verification flag after use

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -encryptedPrivateKey -salt -iv"
  );

  res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
        httpOnly: true,
        secure: true, 
        sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    const userData = await User.findById(user._id).select("-password -refreshToken");
    console.log("userdata-",userData);
    return res.status(200).json(
        
        new ApiResponse(200, { user: userData, accessToken }, "Login successful")
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    // Remove the refresh token from DB
    await User.findByIdAndUpdate(
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


const changeCurrentPassword = asyncHandler(async (req, res) => {
    

    const { oldPassword, newPassword, confPassword } = req.body;
    if (!(newPassword === confPassword)) {
        throw new ApiError(
            400,
            "New Password & Confirm Password do not match "
        );
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found while changing password");
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password while changing password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user,
            },
            "Password changed successfully"
        )
    );
});


export { sendOtp, signupUser, loginUser, logoutUser, changeCurrentPassword };
