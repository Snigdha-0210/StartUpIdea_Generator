export function parseTrendData(
  keyword: string, 
  interestData: any, 
  regionData: any, 
  relatedData: any
) {
  // 1. Process Interest Over Time
  let interest_over_time: Array<{ date: string, value: number }> = [];
  try {
    if (interestData?.default?.timelineData) {
      interest_over_time = interestData.default.timelineData.map((d: any) => ({
        date: d.formattedAxisTime || d.formattedTime,
        value: d.value[0] || 0
      }));
    }
  } catch (e) {
    console.error('Error parsing interest data', e);
  }

  // 2. Process Regional Interest
  let region_interest: Array<{ region: string, value: number }> = [];
  try {
    if (regionData?.default?.geoMapData) {
      region_interest = regionData.default.geoMapData
        .filter((d: any) => d.value[0] > 0)
        .map((d: any) => ({
          region: d.geoName,
          value: d.value[0]
        }))
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 10);
    }
  } catch (e) {
    console.error('Error parsing region data', e);
  }

  // 3. Process Related Queries
  let related_queries = { top: [] as string[], rising: [] as string[] };
  try {
    if (relatedData?.default?.rankedList) {
      const topList = relatedData.default.rankedList[0]?.rankedKeyword || [];
      const risingList = relatedData.default.rankedList[1]?.rankedKeyword || [];
      
      related_queries.top = topList.map((k: any) => k.query).slice(0, 10);
      related_queries.rising = risingList.map((k: any) => k.query).slice(0, 10);
    }
  } catch (e) {
    console.error('Error parsing related data', e);
  }

  // 4. Calculate Trend Score (0-100)
  // We use the last 20% of data to calculate momentum vs the historical average
  let trend_score = 50; 
  if (interest_over_time.length > 5) {
    const values = interest_over_time.map(i => i.value);
    const recentCount = Math.ceil(values.length * 0.2);
    const recentValues = values.slice(-recentCount);
    const pastValues = values.slice(0, values.length - recentCount);
    
    const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const pastAvg = pastValues.reduce((a, b) => a + b, 0) / (pastValues.length || 1);
    
    const currentVal = values[values.length - 1];
    
    // Score based on recent momentum + absolute current volume
    let score = (currentVal * 0.4) + (recentAvg * 0.4);
    
    if (recentAvg > pastAvg) {
      score += 20; // Growing
    } else if (recentAvg < pastAvg) {
      score -= 10; // Declining
    }
    
    trend_score = Math.max(0, Math.min(100, Math.round(score)));
  }

  return {
    keyword,
    interest_over_time,
    region_interest,
    related_queries,
    trend_score
  };
}

// Fallback Mock Generator
export function getFallbackMock(keyword: string) {
  return {
    keyword,
    interest_over_time: [
      { date: "Jan 2023", value: 30 },
      { date: "Jun 2023", value: 50 },
      { date: "Jan 2024", value: 75 },
      { date: "Current", value: 90 }
    ],
    region_interest: [
      { region: "United States", value: 100 },
      { region: "India", value: 85 },
      { region: "United Kingdom", value: 70 }
    ],
    related_queries: {
      top: [keyword + " meaning", keyword + " examples"],
      rising: [keyword + " startup", "invest in " + keyword]
    },
    trend_score: 85
  };
}
