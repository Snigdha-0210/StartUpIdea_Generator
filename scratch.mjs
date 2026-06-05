import Parser from 'rss-parser';

const parser = new Parser();

async function test() {
  try {
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=startups+india&hl=en-US&gl=US&ceid=US:en');
    console.log(`Found ${feed.items.length} items`);
    console.log(feed.items[0].title);
    console.log(feed.items[0].link);
  } catch(e) {
    console.error(e);
  }
}

test();
