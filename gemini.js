// gemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askFromGemini(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const res = await model.generateContent(prompt);
   
    return res;
}

module.exports = {
    askFromGemini
};
