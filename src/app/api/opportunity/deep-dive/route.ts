import { NextResponse } from 'next/server';
import { aiValidationService } from '@/services/aiValidationService';

export async function POST(req: Request) {
  try {
    const { gap } = await req.json();
    const data = await aiValidationService.analyzeSpecificGap(gap);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
