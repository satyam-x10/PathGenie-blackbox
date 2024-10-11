import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();
const API_KEY = process.env.SERP_API_KEY;

async function getSerpResults(topic) {
    const serpApiUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(topic)}&api_key=${API_KEY}`;
    
    try {
        const response = await axios.get(serpApiUrl);
        const data = response.data;
        
        const result = {
            searchMetadata: {
                query: topic,
                timestamp: new Date().toISOString()
            }
        };
        
        // 1. Organic Search Results (Top Websites)
        if (data.organic_results) {
            result.organicResults = data.organic_results.slice(0, 5).map(site => ({
                title: site.title,
                link: site.link,
                snippet: site.snippet
            }));
        }
        
        
        // get ai_overview
        if (data.ai_overview) {
            result.aiOverview = data.ai_overview;
        }
        
        
        // 4. Related Questions (People Also Ask)
        if (data.related_questions) {
            result.relatedQuestions = data.related_questions.map(question => ({
                question: question.question,
                snippet: question.snippet
            }));
        }
        
        // 5. Related Searches
        if (data.related_searches) {
            result.relatedSearches = data.related_searches.map(search => ({
                query: search.query,
                link: search.link
            }));
        }
        
        
        
        // 8. Video Results
        if (data.inline_videos) {
            result.videos = data.inline_videos.slice(0, 3).map(video => ({
                title: video.title,
                link: video.link,
                source: video.source,
                duration: video.duration
            }));
        }
        
        
        // Save the results to response.json
        await fs.writeFile('response.json', JSON.stringify(result, null, 2), 'utf-8');
        console.log('Data saved to response.json');
        return result;
        
    } catch (error) {
        console.error('Error fetching SerpApi results:', error);
        throw error;
    }
}

// Example usage
(async () => {
    try {
        const topic = 'music alphabets, notes, and intervals';
        const results = await getSerpResults(topic);
        console.log('Results:', results);
    } catch (error) {
        console.error('Script execution failed:', error);
    }
})();