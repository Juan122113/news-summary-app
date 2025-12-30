// src/testSummarizer.js
import 'dotenv/config';
import { fetchNews } from './services/rss.js';
import { summarizeNews } from './services/summarizer.js';

async function test() {
    try {
        // Trae las noticias
        const newsItems = await fetchNews();

        if (!newsItems || newsItems.length === 0) {
            console.log('No se encontraron noticias.');
            return;
        }

        // Convierte a texto para el prompt
        const newsText = newsItems
            .map(item => `${item.title}\n${item.summary || ''}`)
            .join('\n');

        // Llama a tu función de resumen
        const summary = await summarizeNews(newsText, 5);

        console.log('--- RESUMEN ---');
        console.log(summary);
    } catch (error) {
        console.error('Error al resumir noticias:', error);
    }
}

test();
