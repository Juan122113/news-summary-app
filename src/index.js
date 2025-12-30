import "dotenv/config";
// import { getNewsOfTheDay } from "./services/rss.js";
// import { generateText } from "./services/huggingface.js";
// import { buildPrompt } from "./utils/prompt.js";

// async function run() {
//   try {
//     const newsText = await getNewsOfTheDay();
//     // console.log(newsText);
//     // const prompt = buildPrompt(newsText, 5);

//     if (!newsText || newsText.trim().length === 0) {
//         console.log("No news found");
//         return;
//     }

//     const summary = await generateText(newsText, 5);

//     console.log("\n=== DAILY NEWS SUMMARY ===\n");
//     console.log(summary);

//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// }

// run();


import { getNewsOfTheDay } from './services/rss.js';
import { summarizeAllNews } from './services/summarizer.js';

async function main() {
  try {
    // 1️⃣ Obtener noticias del feed RSS
    const newsArray = await getNewsOfTheDay(); // debe devolver [{ title, summary }, ...]
    if (!newsArray || newsArray.length === 0) {
      console.log('No se encontraron noticias.');
      return;
    }

    console.log(`Se encontraron ${newsArray.length} noticias. Generando resúmenes...`);

    // 2️⃣ Generar resúmenes individuales y resumen global
    const { summarizedNews, finalSummary } = await summarizeAllNews(newsArray, 5);

    // 3️⃣ Mostrar resúmenes individuales
    console.log('\n=== Resúmenes individuales ===');
    summarizedNews.forEach((summary, index) => {
      console.log(`\nNoticia ${index + 1}:\n${summary}`);
    });

    // 4️⃣ Mostrar resumen global
    console.log('\n=== Resumen global ===');
    console.log(finalSummary);

  } catch (error) {
    console.error('Error en el flujo principal:', error);
  }
}

main();
