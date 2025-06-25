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
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder,
    });
    console.log(" Cloudinary upload result:", result);

    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
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
