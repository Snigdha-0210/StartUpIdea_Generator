require('ts-node/register');
const { googleTrendsService } = require('./src/services/googleTrendsService');

async function run() {
  console.log("Testing Google Trends Comprehensive Endpoint...");
  const data = await googleTrendsService.getComprehensiveTrendData(["AI startups"]);
  console.log(JSON.stringify(data, null, 2));
}

run();
