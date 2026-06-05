const fs = require('fs');
const path = require('path');

const apiCode = {
  'src/app/api/trends/daily/route.ts': `
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
`,
  'src/app/api/trends/realtime/route.ts': `
import { NextResponse } from 'next/server';
import { googleTrendsService } from '@/services/googleTrendsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'US';
    const data = await googleTrendsService.getRealTimeTrends(country);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,
  'src/app/api/trends/interest/route.ts': `
import { NextResponse } from 'next/server';
import { googleTrendsService } from '@/services/googleTrendsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    if (!keyword) return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    
    const data = await googleTrendsService.getInterestOverTime(keyword);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,
  'src/app/api/trends/related/route.ts': `
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
`,
  'src/app/api/trends/compare/route.ts': `
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
`,
  'src/app/api/ideas/validate/route.ts': `
import { NextResponse } from 'next/server';
import { aiValidationService } from '@/services/aiValidationService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idea = body.idea;
    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
    }
    
    const data = await aiValidationService.validateIdea(idea);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`
};

for (const [filepath, content] of Object.entries(apiCode)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
