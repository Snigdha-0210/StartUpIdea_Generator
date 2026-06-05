import { dbService } from './src/services/dbService';

async function verify() {
  console.log('Testing Firestore Connection...');
  
  try {
    // 1. Create User
    await dbService.createUser('test-user-123', { name: 'InnovateX Hacker', role: 'admin' });
    console.log('✅ User created.');

    // 2. Save Startup Idea
    await dbService.saveStartupIdea('test-user-123', 'idea-456', { idea: 'Space Elevator', demandScore: 99 });
    console.log('✅ Idea saved.');

    // 3. Get Ideas
    const ideas = await dbService.getStartupIdeas('test-user-123');
    console.log('✅ Retrieved ideas:', ideas.length);

    console.log('🎉 Firebase Integration Successful!');
  } catch (error) {
    console.error('❌ Firebase Integration Failed:', error);
  }
}

verify();
