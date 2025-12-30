// import "dotenv/config";
// // import { getNewsOfTheDay } from "./services/rss.js";
// // import { generateText } from "./services/huggingface.js";
// // import { buildPrompt } from "./utils/prompt.js";

// // async function run() {
// //   try {
// //     const newsText = await getNewsOfTheDay();
// //     // console.log(newsText);
// //     // const prompt = buildPrompt(newsText, 5);

// //     if (!newsText || newsText.trim().length === 0) {
// //         console.log("No news found");
// //         return;
// //     }

// //     const summary = await generateText(newsText, 5);

// //     console.log("\n=== DAILY NEWS SUMMARY ===\n");
// //     console.log(summary);

// //   } catch (error) {
// //     console.error("Error:", error.message);
// //   }
// // }

// // run();


// import { getNewsOfTheDay } from './services/rss.js';
// import { summarizeAllNews } from './services/summarizer.js';

// async function main() {
//   try {
//     // 1️⃣ Obtener noticias del feed RSS
//     const newsArray = await getNewsOfTheDay(); // debe devolver [{ title, summary }, ...]
//     if (!newsArray || newsArray.length === 0) {
//       console.log('No se encontraron noticias.');
//       return;
//     }

//     console.log(`Se encontraron ${newsArray.length} noticias. Generando resúmenes...`);

//     // 2️⃣ Generar resúmenes individuales y resumen global
//     const { summarizedNews, finalSummary } = await summarizeAllNews(newsArray, 5);

//     // 3️⃣ Mostrar resúmenes individuales
//     console.log('\n=== Resúmenes individuales ===');
//     summarizedNews.forEach((summary, index) => {
//       console.log(`\nNoticia ${index + 1}:\n${summary}`);
//     });

//     // 4️⃣ Mostrar resumen global
//     console.log('\n=== Resumen global ===');
//     console.log(finalSummary);

//   } catch (error) {
//     console.error('Error en el flujo principal:', error);
//   }
// }

// main();


// import "dotenv/config";
// import { getNewsOfTheDay } from './src/services/rss.js';
// import { summarizeAllNews } from './src/services/summarizer.js';

// async function main() {
//   try {
//     console.log('--- 1. Extrayendo noticias de los feeds RSS ---');
//     const newsArray = await getNewsOfTheDay(); 
    
//     if (!newsArray || newsArray.length === 0) {
//       console.log('No se encontraron noticias en los feeds.');
//       return;
//     }

//     console.log(`Se encontraron ${newsArray.length} noticias.`);
//     console.log('--- 2. Generando resumen inteligente con Gemini ---');

//     // Llamamos a la nueva lógica de resumen unificado
//     const { finalSummary } = await summarizeAllNews(newsArray);

//     console.log('\n=============================================');
//     console.log('        BOLETÍN INFORMATIVO DEL DÍA');
//     console.log('=============================================');
//     console.log(finalSummary);
//     console.log('\n=============================================');

//   } catch (error) {
//     console.error('❌ Error en el flujo principal:', error.message);
//   }
// }

// main();


// import express from 'express';
// import cors from 'cors';
// import "dotenv/config";
// import { getNewsOfTheDay } from './services/rss.js';
// import { summarizeAllNews } from './services/summarizer.js';

// const app = express();
// app.use(cors()); // Permite que el frontend acceda

// app.get('/api/news', async (req, res) => {
//   try {
//     const newsArray = await getNewsOfTheDay();
//     const { finalSummary } = await summarizeAllNews(newsArray);
//     res.json({ summary: finalSummary, date: new Date().toLocaleDateString() });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = 3001;
// app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));

import "dotenv/config";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Importa tus servicios (revisa que las rutas sean correctas)
import { getNewsOfTheDay } from './src/services/rss.js';
import { summarizeAllNews } from './src/services/summarizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Servir el archivo HTML cuando entres a http://localhost:3001
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Ruta de la API que el botón del HTML va a llamar
app.get('/api/news', async (req, res) => {
    try {
        console.log('--- Extrayendo noticias ---');
        const newsArray = await getNewsOfTheDay();
        
        console.log('--- Generando resumen con Gemini ---');
        const { finalSummary } = await summarizeAllNews(newsArray);
        
        res.json({ summary: finalSummary });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al procesar las noticias' });
    }
});

app.listen(PORT, () => {
    console.log(`
🚀 ¡Servidor funcionando!
👉 Abre tu navegador en: http://localhost:${PORT}
    `);
});