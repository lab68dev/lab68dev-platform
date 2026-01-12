#!/usr/bin/env node

/**
 * Migration Script for Lib Restructuring
 * 
 * This script helps migrate from old import paths to new organized structure.
 * It scans all TypeScript/JavaScript files and suggests or applies updates.
 * 
 * Usage:
 *   node lib/migrate-imports.js --dry-run   # Preview changes
 *   node lib/migrate-imports.js --apply     # Apply changes
 */

const fs = require('fs');
const path = require('path');

// Mapping of old imports to new imports
const IMPORT_MAPPINGS = {
  // Auth
  "@/lib/features/auth": "@/lib/features/auth",
  "'@/lib/features/auth'": "'@/lib/features/auth'",
  '"@/lib/features/auth"': '"@/lib/features/auth"',
  "./lib/features/auth": "./lib/features/auth",
  "../lib/features/auth": "../lib/features/auth",
  
  // Chat
  "@/lib/features/chat": "@/lib/features/chat",
  "@/lib/features/chat": "@/lib/features/chat",
  
  // Whiteboard
  "@/lib/features/whiteboard": "@/lib/features/whiteboard",
  "@/lib/features/whiteboard": "@/lib/features/whiteboard",
  
  // Database
  "@/lib/database": "@/lib/database",
  "@/lib/database-server": "@/lib/database",
  "@/lib/database": "@/lib/database",
  
  // Config
  "@/lib/config": "@/lib/config",
  "@/lib/config": "@/lib/config",
  
  // Hooks
  "@/lib/hooks": "@/lib/hooks",
  
  // Utils
  "@/lib/utils": "@/lib/utils",
  
  // Team
  "@/lib/features/team": "@/lib/features/team",
  
  // Staff
  "@/lib/features/staff": "@/lib/features/staff",
  "@/lib/features/staff": "@/lib/features/staff",
  "@/lib/features/staff": "@/lib/features/staff",
  
  // Services
  "@/lib/services": "@/lib/services",
};

function findTSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      findTSFiles(filePath, fileList);
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function updateImports(content, dryRun = true) {
  let updated = content;
  const changes = [];
  
  Object.entries(IMPORT_MAPPINGS).forEach(([oldPath, newPath]) => {
    const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (regex.test(updated)) {
      updated = updated.replace(regex, newPath);
      changes.push({ from: oldPath, to: newPath });
    }
  });
  
  return { updated, changes };
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  
  console.log('🔍 Scanning for import statements...\n');
  
  const files = findTSFiles(process.cwd());
  let totalChanges = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const { updated, changes } = updateImports(content, dryRun);
    
    if (changes.length > 0) {
      totalChanges += changes.length;
      console.log(`📝 ${file}`);
      changes.forEach(change => {
        console.log(`   ${change.from} → ${change.to}`);
      });
      console.log('');
      
      if (!dryRun) {
        fs.writeFileSync(file, updated, 'utf-8');
      }
    }
  });
  
  if (dryRun) {
    console.log(`\n✅ Found ${totalChanges} import(s) to update in ${files.length} files`);
    console.log('Run with --apply to make changes\n');
  } else {
    console.log(`\n✅ Updated ${totalChanges} import(s) in ${files.length} files\n`);
  }
}

main();
