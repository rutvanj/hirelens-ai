const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint_report.json', 'utf16le'));
data.forEach(f => {
  f.messages.forEach(m => console.log(`${f.filePath}:${m.line} - ${m.message}`));
});
