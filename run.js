import { cleanResponse } from "./cleanResponse.js";
import { generatePrompt } from "./prompt.js";
import { getNestedTopics } from "./resource.js";
import fs from "fs/promises";

async function run() {
  const prompt = await generatePrompt();
  // console.log('prompt generated:', prompt);
  const response = await getNestedTopics(prompt);
  const cleanedResponse = await cleanResponse(response);

  await fs.writeFile(
    "data.json",
    JSON.stringify(cleanedResponse, null, 2),
    "utf-8",
  );
}

run();
