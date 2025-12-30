import Parser from "rss-parser";
import { htmlToText } from 'html-to-text';

const rssParser = new Parser();
const MAX_NEWS = 15;

export async function getNewsOfTheDay() {
    const feeds = [
        { source: "Perfil", url: "https://www.perfil.com/feed" },
        { source: "La Nación", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/" },
        { source: "Diario Registrado", url: "https://www.diarioregistrado.com/rss.xml" },
    ];

    let newsItems = [];

    for (const feed of feeds) {
        try {
            const feedData = await rssParser.parseURL(feed.url);

            feedData.items.slice(0, 5).forEach(item => {
                newsItems.push(
                    // `[${feed.name}] ${item.title} - ${item.contentSnippet}`
                    {
                        source: feed.source,
                        title: item.title,
                        summary: htmlToText(item["content:encoded"] || item.contentSnippet || item.content || "",{
                            wordwrap: 130
                        })
                    });
            });
        } catch (error) {
        console.log("Error leyendo RSS:", feed.url);
        }

    } 


    return newsItems
        .slice(0, MAX_NEWS);
        // .map(item =>
        //     `Source: ${item.source}\nTitle: ${item.title}\nSummary: ${item.summary}`
        // ).join("\n\n");
}