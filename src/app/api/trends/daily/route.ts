
import { NextResponse } from 'next/server';
import { googleTrendsService } from '@/services/googleTrendsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'US';
    const data = await googleTrendsService.getDailyTrends(country);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
