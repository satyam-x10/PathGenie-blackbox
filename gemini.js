// gemini.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askFromGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const res = await model.generateContent(prompt);

  return res;
}
