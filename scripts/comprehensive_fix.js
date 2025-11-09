const fs = require('fs');

const filePath = 'lib/i18n.ts';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Chinese fixes
const chineseFixes = {
  1876: '        title: "思考。编程。测试。发布。",',
  1877: '        subtitle: "为构建、学习和协作的开发者打造的终极平台。",',
  1890: '        description: "与全球开发者连系。分享知识。共同构建。",',
  1957: '      active: "活跃",',
};

// Japanese fixes
const japaneseFixes = {
  2069: '      clear: "清空画布",',
  2079: '      dashboard: "ダッシュボード",',
  2107: '      happeningToday: "今日のプロジェクトの状況です。",',
  2118: '      allSystemsOperational: "全システムが稼働中",',
  2164: '        title: "考える。コード。テスト。出荷。",',
  2165: '        subtitle: "構築、学習、協力する開発者のための究極のプラットフォーム。",',
};

// Portuguese fix
const portugueseFixes = {
  2325: '      dragCard: "Arraste um cartão para outro status...",',
};

let chineseFixed = 0;
for (const [lineNum, replacement] of Object.entries(chineseFixes)) {
  const idx = parseInt(lineNum);
  if (lines[idx]) {
    lines[idx] = replacement;
    chineseFixed++;
  }
}
console.log(`✓ Fixed ${chineseFixed} Chinese lines`);

let japaneseFixed = 0;
for (const [lineNum, replacement] of Object.entries(japaneseFixes)) {
  const idx = parseInt(lineNum);
  if (lines[idx]) {
    lines[idx] = replacement;
    japaneseFixed++;
  }
}
console.log(`✓ Fixed ${japaneseFixed} Japanese lines`);

let portugueseFixed = 0;
for (const [lineNum, replacement] of Object.entries(portugueseFixes)) {
  const idx = parseInt(lineNum);
  if (lines[idx]) {
    lines[idx] = replacement;
    portugueseFixed++;
  }
}
console.log(`✓ Fixed ${portugueseFixed} Portuguese lines`);

// Write back
content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✅ All remaining encoding issues fixed!');
console.log(`Total fixes: ${chineseFixed + japaneseFixed + portugueseFixed} lines`);
