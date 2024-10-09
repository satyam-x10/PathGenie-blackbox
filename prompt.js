const { askFromGemini } = require('./gemini');

async function generateLearningPrompt() {

    // Get initial input from user
    let initialInput = "I want to learn  ";
    let isSpecific = false;

    while (!isSpecific) {
        console.log("What would you like to learn?");
        initialInput =  await getUserInput();
        console.log(`\nGenerating a learning prompt for: "${initialInput}"`);
        
        // Check if the topic is specific enough
        const evaluationString=`
            Evaluate the following learning interest: "${initialInput}". 
            Determine if it is a valid and suitable niche for learning. 
            Respond with:
            SPECIFIC: true (if the interest is appropriate) or false (if it is not).
        `;
        const specificityCheck = await askFromGemini(evaluationString);

        const checkResult = specificityCheck.response.text();
        isSpecific = checkResult.includes("SPECIFIC: true");

        if (!isSpecific) {
            console.log("\nPlease be more specific about what you want to learn.");
        }
    }

    // Generate the learning prompt
    const promptGenerationString = `
        Generate a clear and concise prompt for learning: "${initialInput}"
        The prompt should be 2-3 sentences maximum focusing on:
        - What exactly needs to be learned
        - The specific goal or outcome
        Do not include any resource suggestions or learning path details.
        Keep it focused and direct.
    `;
    const promptGeneration = await askFromGemini(promptGenerationString);
    
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
