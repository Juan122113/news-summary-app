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

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 1. Servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Ruta de la API con sistema de caché (1h 20m)
app.get('/api/news', async (req, res) => {

    // Configuramos el cache a nivel de servidor (Edge Network)
    // s-maxage: tiempo que Vercel guarda la respuesta
    // stale-while-revalidate: sirve el cache viejo mientras genera uno nuevo en el fondo
    res.setHeader('Cache-Control', 's-maxage=4800, stale-while-revalidate');

    try {
        console.log("🔄 Iniciando nueva extracción y generación (Gasto de API)...");
        const data = await summarizeAllNews(); 
        
        // cacheResumen = data.summary;
        // ultimaVezGenerado = AHORA;

        res.json({ 
            // summary: cacheResumen,
            summary: data.summary,
            cached: false // Para el primer usuario será false, para los demás lo maneja Vercel
        });
    } catch (error) {
        console.error("❌ Error en el proceso:", error);

        // if (cacheResumen) {
        //     console.log("⚠️ API falló, entregando caché de emergencia.");
        //     return res.json({ summary: cacheResumen, warning: "Servicio en alta demanda." });

        res.status(500).json({ error: "No se pudo obtener el resumen." });
        }
    
});

// El servidor necesita "escuchar" en el puerto para que Render sepa que está vivo
app.listen(PORT, () => {
    console.log(`
🚀 ¡Servidor funcionando!
👉 URL: http://localhost:${PORT}
    `);
});

export default app;