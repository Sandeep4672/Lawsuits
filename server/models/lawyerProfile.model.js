import mongoose from "mongoose";

const lawyerProfileSchema = new mongoose.Schema({
  lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer",
    required: true,
    unique: true,
  },
  motto: { type: String },
  aboutMe: { type: String },
  profilePicture: { type: String },

  education: [
    {
      degree: String,            
      university: String,         
      graduationYear: Number,
      certificateUrl: String,
    }
  ],

  experienceYears: { type: Number },
  practiceAreas: [{ type: String }], 

  currentFirm: { type: String },
  officeAddress: { type: String },
  courtAssociations: [{ type: String }], 

  languagesSpoken: [{ type: String }],
  consultationFee: { type: Number }, 
  availability: {
    days: [{ type: String }], 
    timeSlots: [{ start: String, end: String }],
  },

  digitalPresence: {
    linkedin: { type: String },
    website: { type: String },
    barAssociationProfile: { type: String },
  },

  awards: [{ title: String, year: Number }],
  publications: [{ title: String, link: String }],


  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("LawyerProfile", lawyerProfileSchema);
