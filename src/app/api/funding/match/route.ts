import { NextResponse } from 'next/server';
import { aiValidationService } from '@/services/aiValidationService';

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();
    if (!idea) return NextResponse.json({ error: 'Idea required' }, { status: 400 });
    const data = await aiValidationService.matchFunding(idea);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}