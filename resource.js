require('dotenv').config();
const { askFromGemini } = require('./gemini');

async function getUserInput(question) {
    return new Promise((resolve) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question(question, (answer) => {
            readline.close();
            resolve(answer);
        });
    });
}

async function gatherLearningPreferences() {
    const overview = await getUserInput("How much do you want to learn? (just an overview, medium, pro): ");
    const experience = await getUserInput("How much experience do you have in this? (none, beginner, intermediate, expert): ");

    return { overview, experience };
}

async function createMasterPrompt(basePrompt) {
    const { overview, experience } = await gatherLearningPreferences();

    const masterPrompt = `
        ${basePrompt}
        
        Learning Depth: ${overview}
        Experience Level: ${experience}

        Based on these preferences, please guide me towards the goal of becoming proficient. List me the resources and learning path to follow.
    `;
    
    return masterPrompt;
}

async function main() {
    // Get the topic from user input instead of hardcoding it
    const basePrompt = await getUserInput("Please enter the topic you want to learn about: ");
    
    try {
        const masterPrompt = await createMasterPrompt(basePrompt);
        console.log("\nGenerated Master Prompt:");
        console.log(masterPrompt);
        
        const response = await askFromGemini(masterPrompt);
        
        // Call the text() method to get the actual response text
        const responseText = response.response.text();
        
        console.log("Response from Gemini:", responseText);
    } catch (error) {
        console.error("An error occurred:", error);
    }
    
}

main();
