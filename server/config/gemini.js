import { GoogleGenerativeAI } from "@google/generative-ai";

// Validate API key on startup
if (!process.env.GEMINI_API_KEY) {
  console.error("⚠️ GEMINI_API_KEY is not set in environment variables");
  console.log("Please add GEMINI_API_KEY to your .env file");
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Default configuration with increased token limit
const geminiConfig = {
  model: "models/gemini-flash-latest", // Updated model name
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 16000,
    candidateCount: 1,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
};

// Create a model instance
export const getModel = (customConfig = {}) => {
  const config = { ...geminiConfig, ...customConfig };

  return genAI.getGenerativeModel({
    model: config.model,
    generationConfig: config.generationConfig,
    safetySettings: config.safetySettings,
  });
};

// Optional: test connection
export const testConnection = async () => {
  try {
    const model = getModel();
    const result = await model.generateContent("Test");
    const response = await result.response;
    console.log("✓ Gemini AI connection successful");
    return true;
  } catch (error) {
    console.error("✗ Gemini AI connection failed:", error.message);
    return false;
  }
};

export { genAI, geminiConfig };
