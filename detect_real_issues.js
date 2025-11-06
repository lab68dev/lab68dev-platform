const fs = require('fs');

const content = fs.readFileSync('lib/i18n.ts', 'utf8');
const lines = content.split('\n');

console.log('Scanning for ACTUAL encoding corruption...\n');

const realIssues = [];

for(let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check for actual mojibake patterns (not valid accented characters)
  const hasIssue = 
    line.includes('â€') || // UTF-8 double encoding
    line.includes('â„') || // Windows-1252 to UTF-8 issue
    line.includes('Ã©') || // é corrupted
    line.includes('Ã¨') || // è corrupted
    line.includes('Ã´') || // ô corrupted  
    line.includes('Ã¼') || // ü corrupted
    line.includes('Ã¶') || // ö corrupted
    line.includes('Ã¤') || // ä corrupted
    line.includes('Ãª') || // ê corrupted
    line.includes('Ã') || // à corrupted (but not à which is valid)
    line.includes('Ð') ||  // Cyrillic corruption
    line.includes('Æ°') || // Vietnamese corruption
    line.includes('ƒ') ||  // Function symbol corruption
    line.includes('â€™') || // Smart quote corruption
    line.includes('â€œ') || // Smart quote corruption
    line.includes('â€') ||  // Em dash corruption
    (line.includes('â') && !line.match(/[âêîôûŵŷ]/)); // â without being part of circumflex
  
  if (hasIssue && line.includes(':')) {
    realIssues.push({
      line: i + 1,
      text: line.trim()
    });
  }
}

console.log(`Found ${realIssues.length} lines with REAL encoding corruption\n`);

if (realIssues.length > 0) {
  console.log('Lines with actual issues:');
  const grouped = {};
  
  realIssues.forEach(issue => {
    const lang = 
      issue.line < 650 ? 'English' :
      issue.line < 1000 ? 'Spanish' :
      issue.line < 1350 ? 'French' :
      issue.line < 1720 ? 'German' :
      issue.line < 2000 ? 'Chinese' :
      issue.line < 2300 ? 'Japanese' :
      issue.line < 2550 ? 'Portuguese' :
      issue.line < 2850 ? 'Russian' :
      issue.line < 3150 ? 'Vietnamese' : 'Unknown';
    
    if (!grouped[lang]) grouped[lang] = [];
    grouped[lang].push(issue);
  });
  
  Object.entries(grouped).forEach(([lang, issues]) => {
    console.log(`\n${lang} (${issues.length} issues):`);
    issues.slice(0, 5).forEach(i => {
      console.log(`  Line ${i.line}: ${i.text.substring(0, 70)}`);
    });
    if (issues.length > 5) {
      console.log(`  ... and ${issues.length - 5} more`);
    }
  });
} else {
  console.log('✅ No real encoding corruption found!');
  console.log('Note: Valid accented characters like â, é, è, ê are present and correct.');
}
