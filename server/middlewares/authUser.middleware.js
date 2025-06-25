import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const verifyUserJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Access token missing");

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded?.role !== "user") throw new ApiError(403, "Only users can access this route");

    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) throw new ApiError(401, "User not found");

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(401,  "Invalid or expired access token"));
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  console.log("User",req.user);
  if (!req.user?.isAdmin) {
    return next(new ApiError(403, "Access denied. Admins only."));
  }
  next();
})
