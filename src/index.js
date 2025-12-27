import { getNewsOfTheDay } from "./services/rss.js";
import { summarizeNews } from "./services/huggingface.js";
import { buildPrompt } from "./utils/prompt.js";

async function run() {
//   try {
    const newsText = await getNewsOfTheDay();
    console.log(newsText);
    // const prompt = buildPrompt(newsText, 5);

    // const summary = await summarizeNews(prompt);

    // console.log("\n=== DAILY NEWS SUMMARY ===\n");
    // console.log(summary);

//   } catch (error) {
    // console.error("Error:", error.message);
//   }
}

run();
