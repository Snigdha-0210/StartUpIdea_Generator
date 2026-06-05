
import { NextResponse } from 'next/server';
import { googleTrendsService } from '@/services/googleTrendsService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const keywords = body.keywords;
    if (!keywords || !Array.isArray(keywords)) {
      return NextResponse.json({ error: 'Keywords array is required' }, { status: 400 });
    }
    
    const data = await googleTrendsService.compareKeywords(keywords);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
