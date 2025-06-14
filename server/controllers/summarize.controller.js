import fs from "fs";
import pdf from "pdf-parse";


import { callOpenRouter } from "../utils/openAIRouter.js";
export const summarizePDF = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdf(dataBuffer);
    const textToSummarize = pdfData.text.slice(0, 4000); // truncate to stay under token limits

    // Clean up uploaded file
    fs.unlinkSync(file.path);

    const summary = await callOpenRouter(textToSummarize);

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

