import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Lawyer } from "../models/lawyer.model.js";
export const uploadRSAPublicKey = asyncHandler(async (req, res) => {
  const { publicKey } = req.body;
  console.log("publicKey=",publicKey);
  const userOrLawyer = req.user || req.lawyer;
  if (!userOrLawyer) throw new ApiError(401, "Unauthorized");

  if (!publicKey) throw new ApiError(400, "Public key is required");

  userOrLawyer.rsaPublicKey = publicKey;
  await userOrLawyer.save();

  res.status(200).json(new ApiResponse(200, null, "Public key saved"));
});


export const getPublicKeyForUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let person = await User.findById(id).select("rsaPublicKey");
  if (!person) {
    person = await Lawyer.findById(id).select("rsaPublicKey");
  }
  console.log(person.rsaPublicKey);
  if (!person) throw new ApiError(404, "User or Lawyer not found");

  res.status(200).json(new ApiResponse(200, person.rsaPublicKey));
});

