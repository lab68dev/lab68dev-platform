const fs = require('fs');

const filePath = 'lib/i18n.ts';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Final Japanese fixes
const japaneseFixes = {
  2174: '        title: "技術スタック",',
  2178: '        description: "世界中の開発者とつながる。知識を共有する。一緒に構築する。",',
  2289: '      subtitle: "開発者とつながり、知識を共有し、協力する",',
  2290: '      newDiscussion: "新しいディスカッション",',
  2291: '      discussionTitle: "ディスカッションのタイトル",',
  2292: '      discussionContent: "何を考えていますか？",',
  2293: '      category: "カテゴリー",',
  2294: '      selectCategory: "カテゴリーを選択",',
  2295: '      customCategory: "カスタムカテゴリー名",',
};

let japaneseFixed = 0;
for (const [lineNum, replacement] of Object.entries(japaneseFixes)) {
  const idx = parseInt(lineNum);
  if (lines[idx]) {
    lines[idx] = replacement;
    japaneseFixed++;
  }
}
console.log(`✓ Fixed ${japaneseFixed} Japanese lines`);

// Write back
content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✅ Final encoding issues resolved!');
