import "dotenv/config";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { getNewsOfTheDay } from './src/services/rss.js';
import { summarizeAllNews } from './src/services/summarizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 1. Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. API route with caching system (1h 20m)
app.get('/api/news', async (req, res) => {

    // Configure server-side cache (Edge Network)
    // s-maxage: time Vercel stores the response
    // stale-while-revalidate: serves old cache while generating a new one in the background
    res.setHeader('Cache-Control', 's-maxage=4800, stale-while-revalidate');

    try {
        console.log("🔄 Iniciando nueva extracción y generación (Gasto de API)...");
        const data = await summarizeAllNews(); 

        res.json({ 
            summary: data.summary,
            cached: false // It will be false for the first user; Vercel handles it for subsequent users
        });
    } catch (error) {
        console.error("❌ Error en el proceso:", error);

        res.status(500).json({ error: "No se pudo obtener el resumen." });
        }
    
});

// The server needs to "listen" on the port so the hosting service knows it's alive
app.listen(PORT, () => {
    console.log(`
🚀 ¡Servidor funcionando!
👉 URL: http://localhost:${PORT}
    `);
});

export default app;