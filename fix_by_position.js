const fs = require('fs');

const filePath = 'lib/i18n.ts';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// French fixes
if (lines[1285] && lines[1285].includes('upcoming:')) {
  lines[1285] = '      upcoming: "À Venir",';
  console.log('✓ Fixed French line 1286 (upcoming)');
}
if (lines[1288] && lines[1288].includes('Commencez')) {
  lines[1288] = '      planYourProjects: "Commencez à planifier vos projets dès aujourd\'hui",';
  console.log('✓ Fixed French line 1289 (planifier)');
}

// German fix
if (lines[1364] && lines[1364].includes('discussionContent:')) {
  lines[1364] = '      discussionContent: "À quoi pensez-vous?",';
  console.log('✓ Fixed German line 1365 (discussionContent)');
}

// Chinese dashboard fixes (lines 1819-1877)
if (lines[1819] && lines[1819].includes('happeningToday:')) {
  lines[1819] = '      happeningToday: "这是您今天项目的最新动态。",';
  console.log('✓ Fixed Chinese line 1820 (happeningToday)');
}
if (lines[1821] && lines[1821].includes('activeUsers:')) {
  lines[1821] = '      activeUsers: "活跃用户",';
  console.log('✓ Fixed Chinese line 1822 (activeUsers)');
}
if (lines[1824] && lines[1824].includes('apiCalls:')) {
  lines[1824] = '      apiCalls: "API调用",';
  console.log('✓ Fixed Chinese line 1825 (apiCalls)');
}
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

// Portuguese fixes
if (lines[2305] && lines[2305].includes('feedback:')) {
  lines[2305] = '      feedback: "Feedback",';
  console.log('✓ Fixed Portuguese line 2306 (feedback)');
}
if (lines[2340] && lines[2340].includes('dragCard:')) {
  lines[2340] = '      dragCard: "Arraste um cartão para outro status...",';
  console.log('✓ Fixed Portuguese line 2341 (dragCard)');
}
if (lines[2355] && lines[2355].includes('exportImage:')) {
  lines[2355] = '      exportImage: "Exportar Imagem",';
  console.log('✓ Fixed Portuguese line 2356 (exportImage)');
}

// Write back
content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✅ Fixed encoding issues by position');
