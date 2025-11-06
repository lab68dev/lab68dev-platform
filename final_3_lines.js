const fs = require('fs');

const filePath = 'lib/i18n.ts';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines[2296] = '      post: "ディスカッションを投稿",';
lines[2297] = '      noDiscussions: "まだディスカッションがありません",';
lines[2298] = '      startDiscussion: "最初にディスカッションを始めましょう",';

content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed final 3 Japanese lines!');
