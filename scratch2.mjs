import Parser from 'rss-parser';

const parser = new Parser();

async function test() {
  try {
    const q1 = '"startups" OR "venture capital" OR "funding" OR "founders" "india, rajasthan"';
    const url1 = `https://news.google.com/rss/search?q=${encodeURIComponent(q1)}&hl=en-US&gl=US&ceid=US:en`;
    
    const feed1 = await parser.parseURL(url1);
    console.log(`Startups query found ${feed1.items.length} items`);
    if(feed1.items.length > 0) console.log(feed1.items[0].title);

    const q2 = '"economy" OR "macro market" OR "industry trends" OR "infrastructure" "india, rajasthan"';
    const url2 = `https://news.google.com/rss/search?q=${encodeURIComponent(q2)}&hl=en-US&gl=US&ceid=US:en`;
    
    const feed2 = await parser.parseURL(url2);
    console.log(`Business query found ${feed2.items.length} items`);
    if(feed2.items.length > 0) console.log(feed2.items[0].title);

  } catch(e) {
    console.error(e);
  }
}

test();
