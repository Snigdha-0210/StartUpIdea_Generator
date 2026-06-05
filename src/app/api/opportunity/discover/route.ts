import { NextResponse } from 'next/server';
import { aiValidationService } from '@/services/aiValidationService';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { industry, level } = await req.json();
    const data = await aiValidationService.discoverOpportunities(industry, level);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// Force Next.js dev server rebuild