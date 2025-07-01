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


export const uploadPdfToCloudinary = async (
  filePath,
  folder = "Lawsuits"
) => {
  console.log(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const isPdf = ext === ".pdf";
  console.log(isPdf);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      use_filename: true,
      unique_filename: false,
    });

    fs.unlinkSync(filePath); 
    console.log(result.url);
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
