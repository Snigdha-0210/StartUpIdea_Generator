import { NextResponse } from 'next/server';
import { googleTrendsService } from '@/services/googleTrendsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keywordsParam = searchParams.get('keywords');
    const timeframe = searchParams.get('timeframe') || 'today 12-m';
    const geo = searchParams.get('geo') || ''; // Default to global

    if (!keywordsParam) {
      return NextResponse.json({ error: 'Keywords array is required (comma separated)' }, { status: 400 });
    }

    const keywords = keywordsParam.split(',').map(k => k.trim()).filter(Boolean);

    // Limit to 5 keywords at a time to respect Google Trends API bulk limits
    if (keywords.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 keywords allowed per request' }, { status: 400 });
    }

    const data = await googleTrendsService.getComprehensiveTrendData(keywords, timeframe, geo);
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
