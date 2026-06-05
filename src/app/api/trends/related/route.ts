
import { NextResponse } from 'next/server';
import { googleTrendsService } from '@/services/googleTrendsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    if (!keyword) return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    
    const data = await googleTrendsService.getRelatedQueries(keyword);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
