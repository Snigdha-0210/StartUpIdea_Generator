const fs = require('fs');
const path = require('path');

const files = [
  'src/services/api/research-studio.ts',
  'src/services/api/funding.ts',
  'src/services/api/corporate-hub.ts',
  'src/services/api/command-center.ts',
  'src/services/api/builder.ts',
  'src/services/api/report.ts',
  'src/services/api/settings.ts',
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(/new Promise\(r =>/g, "new Promise<any>(r =>");
  fs.writeFileSync(fullPath, content);
});
