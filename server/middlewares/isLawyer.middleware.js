import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const isVerifiedLawyer = asyncHandler(async (req, res, next) => {
  if (req.user?.isLawyer !== "yes") {
    throw new ApiError(403, "Only verified lawyers can perform this action");
  }
  next();
});
