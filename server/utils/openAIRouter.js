import axios from "axios";

const callOpenRouter = async (text) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not set in environment variables");
  }

  
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes legal documents precisely and concisely.",
          },
          {
            role: "user",
            content: `Summarize this PDF content:\n\n${text}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://yourdomain.com",
          "X-Title": "PDF Summarizer",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(" OpenRouter API Error:", error?.response?.data || error.message);
    throw new Error("Failed to summarize PDF using OpenRouter.");
  }
};

export { callOpenRouter };
