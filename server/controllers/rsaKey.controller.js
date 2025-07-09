import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
export const uploadRSAPublicKey = asyncHandler(async (req, res) => {
  const { publicKey } = req.body;
  const user = req.user;

  if (!publicKey) throw new ApiError(400, "Public key is required");

  user.rsaPublicKey = publicKey;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Public key saved"));
});

export const getPublicKeyForUser = asyncHandler(async (req, res) => {
  console.log("Inside Public Key");
  const { id } = req.params;
  const user = await User.findById(id).select("rsaPublicKey");
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, user.rsaPublicKey));
});
