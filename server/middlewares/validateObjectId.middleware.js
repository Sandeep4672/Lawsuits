import mongoose from "mongoose";

export const validateObjectId = (param = "id") => (req, res, next) => {
  const value = req.params[param];
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return res.status(400).json({ message: `Invalid ${param} format` });
  }
  next();
};
