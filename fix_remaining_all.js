const fs = require('fs');

const filePath = 'lib/i18n.ts';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// French remaining fix
if (lines[1288] && lines[1288].includes('planYourProjects:')) {
  lines[1288] = '      planYourProjects: "Commencez à planifier vos projets dès aujourd\'hui",';
  console.log('✓ Fixed French line 1289 (planYourProjects)');
}

// Chinese remaining fixes
if (lines[1843] && lines[1843].includes('communityPosts:')) {
  lines[1843] = '      communityPosts: "社区帖子",';
  console.log('✓ Fixed Chinese line 1844 (communityPosts)');
}
if (lines[1857] && lines[1857].includes('diagramsTitle:')) {
  lines[1857] = '      diagramsTitle: "思考。编程。测试。发布。",';
  console.log('✓ Fixed Chinese line 1858 (diagramsTitle)');
}
if (lines[1870] && lines[1870].includes('filesDesc:')) {
  lines[1870] = '      filesDesc: "上传、管理和共享您的项目文件",';
  console.log('✓ Fixed Chinese line 1871 (filesDesc)');
}
if (lines[1877] && lines[1877].includes('planningSubtitle:')) {
  lines[1877] = '      planningSubtitle: "规划未来成功的路线图",';
  console.log('✓ Fixed Chinese line 1878 (planningSubtitle)');
}

// Japanese fixes (lines 2004-2108)
const japaneseFixes = {
  2003: '      discussionTitle: "討論タイトル",',
  2004: '      discussionContent: "何を考えていますか？",',
  2005: '      category: "カテゴリー",',
  2006: '      selectCategory: "カテゴリーを選択",',
  2007: '      customCategory: "カスタムカテゴリー名",',
  2008: '      post: "討論を投稿",',
  2009: '      noDiscussions: "まだ討論がありません",',
  2010: '      startDiscussion: "最初に討論を始めましょう",',
  2011: '      replies: "返信",',
  2012: '      by: "投稿者",',
  2013: '      cancel: "キャンセル",',
  2014: '      general: "一般",',
  2015: '      help: "ヘルプ",',
  2016: '      showcase: "ショーケース",',
  2017: '      feedback: "フィードバック",',
  2018: '      announcements: "お知らせ",',
  2021: '      title: "かんばん",',
  2022: '      backToProjects: "プロジェクトに戻る",',
  2023: '      addCard: "カードを追加",',
  2024: '      addColumn: "列を追加",',
  2025: '      columnName: "列名",',
  2026: '      cardTitle: "カードタイトル",',
  2027: '      cardDescription: "カード説明",',
  2028: '      assignee: "担当者",',
  2029: '      dueDate: "期限",',
  2030: '      create: "作成",',
  2031: '      cancel: "キャンセル",',
  2032: '      deleteCard: "カードを削除",',
  2033: '      deleteColumn: "列を削除",',
  2034: '      editCard: "カードを編集",',
  2035: '      save: "変更を保存",',
  2036: '      noCards: "まだカードがありません",',
  2037: '      dragCard: "列間でカードをドラッグ",',
  2040: '      title: "フローチャート",',
  2041: '      createNew: "新しい図を作成",',
  2042: '      noDiagrams: "まだ図がありません",',
  2043: '      noDiagramsDesc: "最初のフローチャートを作成してプロセスを可視化",',
  2044: '      diagramName: "図の名前",',
  2045: '      description: "説明",',
  2046: '      create: "作成",',
  2047: '      edit: "編集",',
  2048: '      delete: "削除",',
  2049: '      confirmDelete: "本当にこの図を削除しますか？",',
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

// Portuguese remaining fix
if (lines[2340] && lines[2340].includes('dragCard:')) {
  lines[2340] = '      dragCard: "Arraste um cartão para outro status...",';
  console.log('✓ Fixed Portuguese line 2341 (dragCard)');
}

// Write back
content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✅ All remaining encoding issues fixed!');
