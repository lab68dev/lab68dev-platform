const fs = require('fs');

// Read the file
let content = fs.readFileSync('lib/i18n.ts', 'utf8');

console.log('Starting comprehensive translation fix...\n');

// ==========================================
// SPANISH FIXES
// ==========================================
console.log('Fixing Spanish translations...');
const spanishReplacements = {
  // Common patterns
  'Tâtulo': 'Título',
  'tâtulo': 'título',
  'Categorâa': 'Categoría',
  'categorâa': 'categoría',
  'Tecnologâas': 'Tecnologías',
  'tecnologâas': 'tecnologías',
  'Reuniión': 'Reunión',
  'reuniión': 'reunión',
  'Descripciión': 'Descripción',
  'descripciión': 'descripción',
  'actualizaciión': 'actualización',
  'Notificaciión': 'Notificación',
  'notificaciión': 'notificación',
  'Informaciión': 'Información',
  'informaciión': 'información',
  'Envâa': 'Envía',
  'Artâculo': 'Artículo',
  'artâculo': 'artículo',
  'Discusiión': 'Discusión',
  'discusiión': 'discusión',
  'Contribuciión': 'Contribución',
  'contribuciión': 'contribución',
  'Configuraciión': 'Configuración',
  'configuraciión': 'configuración',
  'Creaciión': 'Creación',
  'creaciión': 'creación',
  'Ediciión': 'Edición',
  'ediciión': 'edición',
  'Secciión': 'Sección',
  'secciión': 'sección',
  'Construcciión': 'Construcción',
  'construcciión': 'construcción',
};

let spanishCount = 0;
Object.entries(spanishReplacements).forEach(([wrong, correct]) => {
  const before = content.length;
  content = content.split(wrong).join(correct);
  const after = content.length;
  if (before !== after) spanishCount++;
});
console.log(`Applied ${spanishCount} Spanish pattern fixes\n`);

// ==========================================
// FRENCH FIXES
// ==========================================
console.log('Fixing French translations...');
const frenchReplacements = {
  'â ': 'à ',
  'créer': 'créer',
  'Créer': 'Créer',
  'Tâche': 'Tâche',
  'tâche': 'tâche',
  'Dernière': 'Dernière',
  'dernière': 'dernière',
  'Détails': 'Détails',
  'détails': 'détails',
  'Général': 'Général',
  'général': 'général',
};

let frenchCount = 0;
Object.entries(frenchReplacements).forEach(([wrong, correct]) => {
  const before = content.length;
  content = content.split(wrong).join(correct);
  const after = content.length;
  if (before !== after) frenchCount++;
});
console.log(`Applied ${frenchCount} French pattern fixes\n`);

// ==========================================
// GERMAN FIXES  
// ==========================================
console.log('Fixing German translations...');
const germanReplacements = {
  'â„nderungen': 'Änderungen',
  'Ã¼ber': 'über',
  'fÃ¼r': 'für',
  'Ã¶ffnen': 'öffnen',
  'hinzufÃ¼gen': 'hinzufügen',
};

let germanCount = 0;
Object.entries(germanReplacements).forEach(([wrong, correct]) => {
  const before = content.length;
  content = content.split(wrong).join(correct);
  const after = content.length;
  if (before !== after) germanCount++;
});
console.log(`Applied ${germanCount} German pattern fixes\n`);

// ==========================================
// RUSSIAN FIXES
// ==========================================
console.log('Fixing Russian translations...');
const russianReplacements = {
  'ÐŸÐ¾': 'По',
  'Ð½Ðµ': 'не',
  'Ñ‚': 'т',
  'ÑÐ¾': 'со',
  'Ð°Ð²': 'ав',
  'Ñ‚Ð¾': 'то',
  'Ñ€Ð¾': 'ро',
  'Ð²': 'в',
};

let russianCount = 0;
Object.entries(russianReplacements).forEach(([wrong, correct]) => {
  const before = content.length;
  content = content.split(wrong).join(correct);
  const after = content.length;
  if (before !== after) russianCount++;
});
console.log(`Applied ${russianCount} Russian pattern fixes\n`);

// ==========================================
// VIETNAMESE FIXES
// ==========================================
console.log('Fixing Vietnamese translations...');
const vietnameseReplacements = {
  'ChÆ°a': 'Chưa',
  'ciàcá»™ng': 'cộng',
  'viâªn': 'viên',
  'tÃ¡c': 'tác',
};

let vietnameseCount = 0;
Object.entries(vietnameseReplacements).forEach(([wrong, correct]) => {
  const before = content.length;
  content = content.split(wrong).join(correct);
  const after = content.length;
  if (before !== after) vietnameseCount++;
});
console.log(`Applied ${vietnameseCount} Vietnamese pattern fixes\n`);

// ==========================================
// JAPANESE FIXES
// ==========================================
console.log('Fixing Japanese translations...');
const japaneseReplacements = {
  'â¾â ': 'まだ',
  '‚³âƒ©': 'コラ',
  'âƒœâƒ¬': 'ボレ',
  'âƒ¼âŒâ„': 'ーター',
  '‚¿âŒ': 'タ',
  '³âƒ©': 'コラ',
  'âƒ': '',
};

let japaneseCount = 0;
Object.entries(japaneseReplacements).forEach(([wrong, correct]) => {
  const before = content.length;
  content = content.split(wrong).join(correct);
  const after = content.length;
  if (before !== after) japaneseCount++;
});
console.log(`Applied ${japaneseCount} Japanese pattern fixes\n`);

// Save the file
fs.writeFileSync('lib/i18n.ts', content, 'utf8');

console.log('===========================================');
console.log('Translation fix completed!');
console.log('===========================================');
console.log('Total patterns fixed:');
console.log('- Spanish:', spanishCount);
console.log('- French:', frenchCount);
console.log('- German:', germanCount);
console.log('- Russian:', russianCount);
console.log('- Vietnamese:', vietnameseCount);
console.log('- Japanese:', japaneseCount);
console.log('===========================================\n');

// Verify remaining issues
const lines = content.split('\n');
const remainingIssues = [];
for(let i = 0; i < lines.length; i++) {
  if(lines[i].includes('â') || lines[i].includes('Ã') || lines[i].includes('Â') || 
     lines[i].includes('Ð') || lines[i].includes('Æ°') || lines[i].includes('ƒ')) {
    remainingIssues.push({line: i+1, text: lines[i].trim().substring(0, 60)});
  }
}

if (remainingIssues.length > 0) {
  console.log(`WARNING: Found ${remainingIssues.length} lines still with encoding issues`);
  console.log('Sample remaining issues:');
  remainingIssues.slice(0, 5).forEach(i => console.log(`Line ${i.line}: ${i.text}`));
} else {
  console.log('✅ No encoding issues detected!');
}
