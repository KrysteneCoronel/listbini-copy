const fs = require('fs');
const path = require('path');

const uiDir = 'components/ui';
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(uiDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove version suffixes from imports
  content = content.replace(/@[0-9]+\.[0-9]+\.[0-9]+/g, '');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
});

console.log('All UI imports fixed!');
