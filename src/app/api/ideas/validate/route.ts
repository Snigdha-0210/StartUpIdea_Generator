
import { NextResponse } from 'next/server';
import { aiValidationService } from '@/services/aiValidationService';
import { dbService } from '@/services/dbService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idea, industry, skills, targetScope, specificLocation, budget, time } = body;
    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
    }
    
    const data = await aiValidationService.validateIdea(idea, industry, skills, targetScope, specificLocation, budget, time);
    
    // Save to Firebase
    try {
      const ideaId = `idea_${Date.now()}`;
      await dbService.saveStartupIdea('demo-user-123', ideaId, data);
    } catch (dbError) {
      console.error("Failed to save to Firebase:", dbError);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
