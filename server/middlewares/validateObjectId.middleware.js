import mongoose from "mongoose";

export const validateObjectId = (param = "id") => (req, res, next) => {
  console.log("Inside validate object id middleware");
  const value = req.params[param];
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return res.status(400).json({ message: `Invalid ${param} format` });
  }
  next();
};
