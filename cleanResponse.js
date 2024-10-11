export async function cleanResponse(response) {
  try {
    // Try parsing the response to check if it's a valid JSON
    const parsedResponse = JSON.parse(response);
    return parsedResponse;
  } catch (error) {
    // If the response is not valid JSON, clean redundant text here
    // This can be customized based on your response structure
    console.log("Invalid JSON. Cleaning redundant text...");
    const cleanedResponse = response.replace(/Some redundant text/g, "");

    // Try parsing again after cleaning
    try {
      return JSON.parse(cleanedResponse);
    } catch (e) {
      console.error("Failed to clean and parse the response:", e);
      return null; // Return null if still invalid
    }
  }
}
