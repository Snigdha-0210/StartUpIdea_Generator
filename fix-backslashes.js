const fs = require('fs');
const path = require('path');

const files = [
  'src/services/googleTrendsService.ts',
  'src/services/aiValidationService.ts',
  'src/app/(dashboard)/startup-generator/page.tsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(/\\\$/g, '$');
  content = content.replace(/\\`/g, '`');
  fs.writeFileSync(fullPath, content);
});
