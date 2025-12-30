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

// import "dotenv/config";
// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Importa tus servicios (revisa que las rutas sean correctas)
// import { getNewsOfTheDay } from './src/services/rss.js';
// import { summarizeAllNews } from './src/services/summarizer.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 3001;

// // 1. Servir el archivo HTML cuando entres a http://localhost:3001
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// // 2. Ruta de la API que el botón del HTML va a llamar
// // --- VARIABLES DE CACHÉ (Ponlas fuera de la ruta, al principio del archivo) ---
// let cacheResumen = null;
// let ultimaVezGenerado = null;

// app.get('/api/news', async (req, res) => {
//     const AHORA = Date.now();
//     // 1 hora y 20 minutos = 80 minutos = 4800000 milisegundos
//     const TIEMPO_ESPERA = 80 * 60 * 1000; 

//     // Verificamos si tenemos un resumen guardado que todavía sirva
//     if (cacheResumen && ultimaVezGenerado && (AHORA - ultimaVezGenerado < TIEMPO_ESPERA)) {
//         const minutosRestantes = Math.round((TIEMPO_ESPERA - (AHORA - ultimaVezGenerado)) / 60000);
//         console.log(`✅ Cache hit: Faltan ${minutosRestantes} min para la próxima actualización.`);
        
//         return res.json({ 
//             summary: cacheResumen,
//             cached: true 
//         });
//     }

//     // Si no hay caché o ya pasó el tiempo, generamos uno nuevo
//     try {
//         console.log("🔄 Iniciando nueva extracción y generación (Gasto de API)...");
        
//         // Llamamos a tu función de summarizer
//         const data = await summarizeAllNews(); 
        
//         // Guardamos el resultado en la "memoria" del servidor
//         cacheResumen = data.summary;
//         ultimaVezGenerado = AHORA;

//         res.json({ 
//             summary: cacheResumen,
//             cached: false 
//         });
//     } catch (error) {
//         console.error("❌ Error en el proceso:", error);

//         // Si la API falla por cuota pero tenemos algo en caché (aunque sea viejo), lo enviamos
//         if (cacheResumen) {
//             console.log("⚠️ API falló, entregando caché de emergencia.");
//             return res.json({ summary: cacheResumen, warning: "Servicio en alta demanda." });
//         }

//         res.status(500).json({ error: "No se pudo obtener el resumen y no hay caché disponible." });
//     }
// });


import "dotenv/config";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Importa tus servicios (revisa que las rutas sean correctas según tu carpeta src)
import { getNewsOfTheDay } from './src/services/rss.js';
import { summarizeAllNews } from './src/services/summarizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// --- VARIABLES DE CACHÉ ---
let cacheResumen = null;
let ultimaVezGenerado = null;

// 1. Servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Ruta de la API con sistema de caché (1h 20m)
app.get('/api/news', async (req, res) => {
    const AHORA = Date.now();
    const TIEMPO_ESPERA = 80 * 60 * 1000; 

    if (cacheResumen && ultimaVezGenerado && (AHORA - ultimaVezGenerado < TIEMPO_ESPERA)) {
        const minutosRestantes = Math.round((TIEMPO_ESPERA - (AHORA - ultimaVezGenerado)) / 60000);
        console.log(`✅ Cache hit: Faltan ${minutosRestantes} min para actualizar.`);
        
        return res.json({ 
            summary: cacheResumen,
            cached: true 
        });
    }

    try {
        console.log("🔄 Iniciando nueva extracción y generación (Gasto de API)...");
        const data = await summarizeAllNews(); 
        
        cacheResumen = data.summary;
        ultimaVezGenerado = AHORA;

        res.json({ 
            summary: cacheResumen,
            cached: false 
        });
    } catch (error) {
        console.error("❌ Error en el proceso:", error);

        if (cacheResumen) {
            console.log("⚠️ API falló, entregando caché de emergencia.");
            return res.json({ summary: cacheResumen, warning: "Servicio en alta demanda." });
        }

        res.status(500).json({ error: "No se pudo obtener el resumen." });
    }
});

// --- ¡IMPORTANTE!: ESTO FALTABA ---
// El servidor necesita "escuchar" en el puerto para que Render sepa que está vivo
app.listen(PORT, () => {
    console.log(`
🚀 ¡Servidor funcionando!
👉 URL: http://localhost:${PORT}
    `);
});