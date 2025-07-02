import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});


export const uploadFileToCloudinary = async (filePath, folder) => {
  try {
    if (!folder) {
      throw new Error("Cloudinary folder name is required.");
    }
    console.log(filePath,folder);
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      use_filename: true,
      unique_filename: false,
      resource_type:"auto"
    });

    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.log("In catch cloudinary");
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};



export const deleteFileFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(" Cloudinary Delete Error:", error);
    throw error;
  }
};
