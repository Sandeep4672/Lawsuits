import axios from "axios";


const callOpenRouter = async (text) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo", 
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes documents.",
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
};

export { callOpenRouter };