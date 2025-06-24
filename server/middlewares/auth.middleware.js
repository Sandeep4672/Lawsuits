import { User } from "../models/user.model.js";
import { Lawyer } from "../models/lawyer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError(401, "Access token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user = null;

    if (decoded?.role === "lawyer") {
      user = await Lawyer.findById(decoded._id).select("-password");
      req.userType = "lawyer";
    } else {
      user = await User.findById(decoded._id).select("-password -refreshToken");
      req.userType = "user";
    }

    if (!user) {
      return next(new ApiError(401, "User not found or token invalid"));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(
      new ApiError(401, err?.message || "Invalid or expired access token")
    );
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  console.log("User",req.user);
  if (!req.user?.isAdmin) {
    return next(new ApiError(403, "Access denied. Admins only."));
  }
  next();
});
