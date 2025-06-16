import fs from "fs";
import pdf from "pdf-parse";
import { callOpenRouter } from "../utils/openAIRouter.js";

import { extractLegalTerms } from "../utils/extractLegalTerms.js";

export const summarizePdfFile = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  const fullText = pdfData.text;

  const textToSummarize = fullText.slice(0, 4000);
  const summary = await callOpenRouter(textToSummarize);

  const legalTerms = extractLegalTerms(fullText);

  return { summary, legalTerms };
};

export const summarizePDF = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const { summary, legalTerms } = await summarizePdfFile(file.path);
    fs.unlinkSync(file.path); 

    res.json({ summary, legalTerms });
  } catch (error) {
    console.error("Error in summarizePDF:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};
