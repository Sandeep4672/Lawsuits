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
