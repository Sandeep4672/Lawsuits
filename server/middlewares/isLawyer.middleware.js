import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const isVerifiedLawyer = asyncHandler(async (req, res, next) => {
  if (req.userType !== "lawyer") {
    throw new ApiError(403, "Only lawyers can access this route");
  }
  next();
});

