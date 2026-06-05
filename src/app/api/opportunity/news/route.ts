import { NextResponse } from 'next/server';
import { fetchGlobalStartupNews } from '@/services/newsService';

export async function POST(req: Request) {
  try {
    const { level, topic, region } = await req.json();
    const news = await fetchGlobalStartupNews(level, topic, region);
    return NextResponse.json({ success: true, news });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 });
  }
}
// Force Next.js recompilation to pick up newsService changes.
