import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  keywords: [{ type: String }], 
});

export default mongoose.model("FAQ", faqSchema);
