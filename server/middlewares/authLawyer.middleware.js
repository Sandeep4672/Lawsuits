import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { Lawyer } from "../models/lawyer.model.js";

export const verifyLawyerJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Access token missing");

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded?.role !== "lawyer") throw new ApiError(403, "Only lawyers can access this route");

    const lawyer = await Lawyer.findById(decoded._id).select("-password -refreshToken");
    if (!lawyer) throw new ApiError(401, "Lawyer not found");

    req.user = lawyer;
    next();
  } catch (err) {
    return next(new ApiError(401, err?.message || "Invalid or expired access token"));
  }
});
