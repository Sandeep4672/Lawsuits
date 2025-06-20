import { User } from "../models/user.model.js";
import { LawyerProfile } from "../models/lawyer.model.js";
import { uploadPdfToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const applyAsLawyer = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      fullLawyerName,
      professionalEmail,
      phone,
      barId,
      practiceAreas,
      experience,
      sop,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isLawyer === "yes") {
      return res.status(400).json({ message: "Already a verified lawyer" });
    }

    if (user.isLawyer === "pending") {
      return res.status(400).json({ message: "Application already pending" });
    }

    const proofUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadPdfToCloudinary(file.path, "lawyers/proof");
        proofUrls.push(result.secure_url);

        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path); 
        }
      }
    } else {
      return res.status(400).json({ message: "At least one proof file is required" });
    }

    let parsedPracticeAreas = [];

    try {
      if (typeof practiceAreas === "string") {
        parsedPracticeAreas = JSON.parse(practiceAreas);
      } else if (Array.isArray(practiceAreas)) {
        parsedPracticeAreas = practiceAreas;
      }
    } catch (err) {
      parsedPracticeAreas = [practiceAreas];
    }

    const lawyerProfile = new LawyerProfile({
      user: user._id,
      fullLawyerName,
      professionalEmail,
      phone,
      barId,
      practiceAreas: parsedPracticeAreas,
      experience,
      sop,
      proofFile: proofUrls,
    });

    await lawyerProfile.save();

    user.isLawyer = "pending";
    await user.save();

    return res.status(201).json({
      message: "Lawyer application submitted successfully",
      lawyerProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const getLawyerProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("fullName email isLawyer");

    if (!user || user.isLawyer !== "yes") {
      return res.status(404).json({ message: "Verified lawyer not found" });
    }

    const profile = await LawyerProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }

    return res.status(200).json({
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};
