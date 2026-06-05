// @ts-ignore
import googleTrends from 'google-trends-api';
import { parseTrendData, getFallbackMock } from '@/utils/trendsParser';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = 3, backoff = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries <= 0) {
      console.error('[Google Trends API] Max retries reached.', error);
      throw error;
    }
    console.warn(`[Google Trends API] Request failed. Retrying in ${backoff}ms... (${retries} retries left)`);
    await delay(backoff);
    return withRetry(fn, retries - 1, backoff * 2);
  }
}

const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

async function fetchWithCache(key: string, fetcher: () => Promise<string>): Promise<any> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  const rawData = await withRetry(fetcher);
  try {
    const parsed = JSON.parse(rawData);
    cache.set(key, { data: parsed, timestamp: Date.now() });
    return parsed;
  } catch (e) {
    throw new Error('Invalid JSON from Google Trends');
  }
}

export const googleTrendsService = {
  async getDailyTrends(geo = 'US') {
    return fetchWithCache(`daily-${geo}`, () => googleTrends.dailyTrends({ geo }));
  },

  async getRealTimeTrends(geo = 'US') {
    return fetchWithCache(`realtime-${geo}`, () => googleTrends.realTimeTrends({ geo }));
  },

  async getInterestOverTime(keyword: string | string[]) {
    const key = Array.isArray(keyword) ? keyword.join(',') : keyword;
    return fetchWithCache(`interest-${key}`, () => googleTrends.interestOverTime({ keyword }));
  },

  async getRelatedQueries(keyword: string) {
    return fetchWithCache(`related-queries-${keyword}`, () => googleTrends.relatedQueries({ keyword }));
  },

  async getRelatedTopics(keyword: string) {
    return fetchWithCache(`related-topics-${keyword}`, () => googleTrends.relatedTopics({ keyword }));
  },

  async compareKeywords(keywords: string[]) {
    return this.getInterestOverTime(keywords);
  },

  async getInterestByRegion(keyword: string, geo?: string) {
    const geoKey = geo || 'global';
    return fetchWithCache(`region-${keyword}-${geoKey}`, () => googleTrends.interestByRegion({ keyword, geo: geo === 'global' ? '' : geo }));
  },

  // NEW COMPREHENSIVE ENDPOINT FOR STRICT JSON SPEC
  async getComprehensiveTrendData(keywords: string[], timeframe: string = 'today 12-m', geo: string = '') {
    const results = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`[Google Trends] Fetching comprehensive data for: ${keyword}`);
        
        // Parallel fetching
        const [interestRaw, regionRaw, relatedRaw] = await Promise.all([
          fetchWithCache(`interest-${keyword}-${timeframe}-${geo}`, () => 
            googleTrends.interestOverTime({ keyword, startTime: getStartTime(timeframe), geo })
          ).catch(() => null),
          
          fetchWithCache(`region-${keyword}-${timeframe}-${geo}`, () => 
            googleTrends.interestByRegion({ keyword, startTime: getStartTime(timeframe), geo })
          ).catch(() => null),
          
          fetchWithCache(`related-queries-${keyword}-${timeframe}-${geo}`, () => 
            googleTrends.relatedQueries({ keyword, startTime: getStartTime(timeframe), geo })
          ).catch(() => null)
        ]);

        if (!interestRaw && !regionRaw && !relatedRaw) {
          throw new Error("All data sources returned null");
        }

        const parsedData = parseTrendData(keyword, interestRaw, regionRaw, relatedRaw);
        results.push(parsedData);
      } catch (error) {
        console.error(`[Google Trends] Failed to fetch data for ${keyword}, using fallback mock.`, error);
        results.push(getFallbackMock(keyword));
      }
    }
    
    return results;
  }
};

function getStartTime(timeframe: string) {
  const now = new Date();
  if (timeframe === 'today 1-m') return new Date(now.setMonth(now.getMonth() - 1));
  if (timeframe === 'today 3-m') return new Date(now.setMonth(now.getMonth() - 3));
  if (timeframe === 'today 12-m') return new Date(now.setFullYear(now.getFullYear() - 1));
  if (timeframe === 'today 5-y') return new Date(now.setFullYear(now.getFullYear() - 5));
  return new Date(now.setFullYear(now.getFullYear() - 1)); // Default 1 year
}
