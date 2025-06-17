import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

export const callEmbeddingAPI = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });

    const result = await model.embedContent({
      content: {
        parts: [{ text }],
      },
      taskType: "retrieval_document", // or semantic_similarity
    });

    return result.embedding.values;
  } catch (error) {
    console.error("Gemini Embedding Error:", error.message);
    throw new Error("Failed to generate embedding from Gemini");
  }
};
