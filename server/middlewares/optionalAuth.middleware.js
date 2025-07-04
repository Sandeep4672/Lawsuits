import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const optionalAuth = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded._id).select("_id");
  } catch (err) {
    req.user = null;
  }

  next();
};
