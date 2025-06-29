import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});


export const uploadPdfToCloudinary = async (filePath, folder = "Lawsuits/messages") => {
  const ext = path.extname(filePath).toLowerCase();
  const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
  const resourceType = isImage ? "image" : "raw";

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder,
    });

    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
    throw error;
  }
};


export const deletePdfFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch (error) {
    console.error(" Cloudinary Delete Error:", error);
    throw error;
  }
};
