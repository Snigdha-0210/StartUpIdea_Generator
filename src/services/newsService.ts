import Parser from 'rss-parser';

const parser = new Parser();

export async function fetchGlobalStartupNews(level: string = 'Global', topic: string = 'Startups', region: string = '') {
  try {
    let baseQuery = '';
    if (topic === 'Startups') {
      baseQuery = '"startups" OR "venture capital" OR "funding" OR "founders" OR "seed round"';
    } else {
      baseQuery = '"economy" OR "macro market" OR "industry trends" OR "infrastructure" OR "business"';
    }
    
    let query = baseQuery;
    if (level !== 'Global' && region.trim() !== '') {
      query = `${baseQuery} "${region.trim()}"`;
    }

    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    
    console.log(`[NewsService] Fetching RSS for query: ${query} from ${url}`);
    
    // We fetch the XML manually using standard fetch with no-store to force fresh results for testing
    const res = await fetch(url, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch RSS feed: ${res.status}`);
    }

    const xml = await res.text();
    const feed = await parser.parseString(xml);
    
    let allNews = feed.items.map(item => {
      // Google News snippets often contain HTML, so we strip it.
      const snippet = item.contentSnippet || item.content || '';
      const cleanSnippet = snippet.replace(/(<([^>]+)>)/gi, "").slice(0, 150) + "...";
      
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: cleanSnippet,
        category: topic
      };
    });
    
    // Sort by most recent
    allNews.sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime());
    
    return allNews.slice(0, 50); // Return top 50 items
  } catch (error) {
    console.error("[NewsService] Error fetching live news, falling back:", error);
    return [
      {
        title: "Could not fetch real-time news for this exact query.",
        link: "#",
        pubDate: new Date().toISOString(),
        contentSnippet: "Please try again later or refine your search parameters.",
        category: topic
      }
    ];
  }
}
