import * as fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length > 0) {
    process.env[key.trim()] = val.join('=').trim().replace(/"/g, '').replace(/\r/g, '');
  }
});

async function test() {
  try {
    const { aiValidationService } = await import('./src/services/aiValidationService');
    const res = await aiValidationService.discoverOpportunities('Tech', 'Global');
    console.log(`Generated ${res.length} items`);
    if (res.length < 50) {
      console.log('Returned items:', JSON.stringify(res, null, 2));
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
