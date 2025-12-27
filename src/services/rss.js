import Parser from "rss-parser";

const rssParser = new Parser();

export async function getNewsOfTheDay() {
    const feeds = [
        { source: "Infobae", url: "https://www.infobae.com/feeds/rss/" },
        { source: "La Nación", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/" },
        { source: "BBC Mundo", url: "https://feeds.bbci.co.uk/mundo/rss.xml" },
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
                        summary: item.contentSnippet || item.content || ""
                    }
                );
            });
        } catch (error) {
        console.log("Error leyendo RSS:", feed.url);
        }

    } 


    return newsItems
        .map(item =>
            `Source: ${item.source}\nTitle: ${item.title}\nSummary: ${item.summary}`
        ).join("\n\n");
}