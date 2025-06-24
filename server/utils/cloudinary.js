import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

export const uploadPdfToCloudinary = async (filePath, folder = "Lawsuits") => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder, 
  });
  console.log("Cloudinary upload result:", result);
  fs.unlinkSync(filePath);
  return result;
};


export const deletePdfFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
};
