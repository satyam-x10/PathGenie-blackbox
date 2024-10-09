require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateLearningPrompt() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Get initial input from user
    let initialInput = "I want to learn  ";
    let isSpecific = false;

    while (!isSpecific) {
        console.log("What would you like to learn?");
        initialInput = initialInput+" "+ await getUserInput();
        
        // Check if the topic is specific enough
        const specificityCheck = await model.generateContent(`
            Analyze if this learning interest is specific enough: "${initialInput}"
            Respond with only:
            SPECIFIC: true/false
            REASON: brief explanation why
        `);

        const checkResult = specificityCheck.response.text();
        isSpecific = checkResult.includes("SPECIFIC: true");

        if (!isSpecific) {
            console.log("\nPlease be more specific about what you want to learn.");
        }
    }

    // Generate the learning prompt
    const promptGeneration = await model.generateContent(`
        Generate a clear and concise prompt for learning: "${initialInput}"
        The prompt should be 2-3 sentences maximum focusing on:
        - What exactly needs to be learned
        - The specific goal or outcome
        Do not include any resource suggestions or learning path details.
        Keep it focused and direct.
    `);
    
    return promptGeneration.response.text();
}

function getUserInput() {
    return new Promise((resolve) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('> ', (answer) => {
            readline.close();
            resolve(answer);
        });
    });
}

async function main() {
    try {
        const prompt = await generateLearningPrompt();
        if (prompt) {
            console.log("\nGenerated Learning Prompt:");
            console.log(prompt);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
