#!/usr/bin/env node

/**
 * Knowledge Base Indexer
 * Indexes documentation and code into the RAG system
 * 
 * Usage:
 *   node scripts/index-knowledge.js
 *   node scripts/index-knowledge.js --category=docs
 *   node scripts/index-knowledge.js --clear
 */

import fs from 'fs'
import path from 'path'
import { ragService } from '../lib/services/rag-service.js'

// Configuration
const DOCS_DIR = path.join(process.cwd(), 'docs')
const CHUNK_SIZE = 1000 // Characters per chunk
const CHUNK_OVERLAP = 200 // Overlap between chunks

/**
 * Split text into chunks with overlap
 */
function chunkText(text, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + size, text.length)
    const chunk = text.slice(start, end)
    
    // Only add non-empty chunks
    if (chunk.trim()) {
      chunks.push(chunk.trim())
    }

    start += size - overlap
  }

  return chunks
}

/**
 * Extract title from markdown file
 */
function extractTitle(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  return titleMatch ? titleMatch[1].trim() : null
}

/**
 * Process a markdown file
 */
function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const relativePath = path.relative(process.cwd(), filePath)
  const title = extractTitle(content) || path.basename(filePath, '.md')

  // Split into chunks
  const chunks = chunkText(content)

  return chunks.map((chunk, index) => ({
    content: chunk,
    category: 'documentation',
    source: relativePath,
    title: chunks.length > 1 ? `${title} (Part ${index + 1}/${chunks.length})` : title,
    metadata: {
      fileType: 'markdown',
      chunkIndex: index,
      totalChunks: chunks.length,
    },
  }))
}

/**
 * Get all markdown files in a directory
 */
function getMarkdownFiles(dir) {
  const files = []

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        traverse(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }

  traverse(dir)
  return files
}

/**
 * Index all documentation
 */
async function indexDocumentation() {
  console.log('📚 Starting documentation indexing...\n')

  try {
    // Get all markdown files
    const markdownFiles = getMarkdownFiles(DOCS_DIR)
    console.log(`Found ${markdownFiles.length} markdown files`)

    let totalDocuments = 0

    // Process each file
    for (const filePath of markdownFiles) {
      const relativePath = path.relative(process.cwd(), filePath)
      console.log(`Processing: ${relativePath}`)

      const documents = processMarkdownFile(filePath)
      await ragService.addDocuments(documents)

      totalDocuments += documents.length
      console.log(`  ✅ Added ${documents.length} chunks\n`)
    }

    console.log(`\n✨ Indexing complete!`)
    console.log(`   Total files: ${markdownFiles.length}`)
    console.log(`   Total chunks: ${totalDocuments}`)
  } catch (error) {
    console.error('❌ Error indexing documentation:', error)
    process.exit(1)
  }
}

/**
 * Add sample platform features
 */
async function indexPlatformFeatures() {
  console.log('📋 Adding platform features...\n')

  const features = [
    {
      content: 'Lab68 Dev Platform is a comprehensive project management and collaboration platform. It includes features like project management, team collaboration, AI-powered tools, resume builder, diagrams, whiteboard, wiki, and real-time chat.',
      category: 'feature',
      source: 'platform-overview',
      title: 'Platform Overview',
      metadata: { type: 'overview' },
    },
    {
      content: 'The AI Tools feature allows users to chat with AI assistants powered by Ollama. It supports local models like DeepSeek R1, Llama, and Mistral. The AI can help with coding, planning, and answering questions about the platform.',
      category: 'feature',
      source: 'ai-tools',
      title: 'AI Tools Feature',
      metadata: { type: 'feature', module: 'ai-tools' },
    },
    {
      content: 'Project Management includes Kanban boards, sprint planning, issue tracking, and team collaboration. It supports epics, stories, tasks, and subtasks with priority levels and labels.',
      category: 'feature',
      source: 'projects',
      title: 'Project Management',
      metadata: { type: 'feature', module: 'projects' },
    },
    {
      content: 'The Resume Builder allows users to create professional resumes with templates, export to PDF, and manage multiple resume versions. It includes sections for experience, education, skills, and projects.',
      category: 'feature',
      source: 'resume-builder',
      title: 'Resume Builder',
      metadata: { type: 'feature', module: 'resume' },
    },
    {
      content: 'Diagram feature supports creating flowcharts, sequence diagrams, class diagrams, and more using Mermaid.js. Users can export diagrams as PNG or SVG.',
      category: 'feature',
      source: 'diagrams',
      title: 'Diagram Creator',
      metadata: { type: 'feature', module: 'diagrams' },
    },
    {
      content: 'Real-time collaboration with Socket.io enables live chat, notifications, and presence indicators. Users can see who is online and communicate in real-time.',
      category: 'feature',
      source: 'collaboration',
      title: 'Real-time Collaboration',
      metadata: { type: 'feature', module: 'collaboration' },
    },
    {
      content: 'The platform uses Supabase for database, authentication, and real-time features. It supports row-level security, user management, and secure data storage.',
      category: 'technical',
      source: 'tech-stack',
      title: 'Technical Stack - Supabase',
      metadata: { type: 'technical', component: 'database' },
    },
    {
      content: 'Built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Uses shadcn/ui components for a consistent design system.',
      category: 'technical',
      source: 'tech-stack',
      title: 'Technical Stack - Frontend',
      metadata: { type: 'technical', component: 'frontend' },
    },
  ]

  try {
    const ids = await ragService.addDocuments(features)
    console.log(`✅ Added ${ids.length} platform features\n`)
  } catch (error) {
    console.error('❌ Error adding features:', error)
    process.exit(1)
  }
}

/**
 * Clear knowledge base
 */
async function clearKnowledgeBase(category) {
  console.log(`🗑️  Clearing knowledge base${category ? ` (category: ${category})` : ''}...`)

  try {
    await ragService.clearAllDocuments(category)
    console.log('✅ Knowledge base cleared\n')
  } catch (error) {
    console.error('❌ Error clearing knowledge base:', error)
    process.exit(1)
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  const clearFlag = args.includes('--clear')
  const categoryArg = args.find((arg) => arg.startsWith('--category='))
  const category = categoryArg ? categoryArg.split('=')[1] : null

  console.log('🚀 Lab68 Knowledge Base Indexer\n')

  // Clear if requested
  if (clearFlag) {
    await clearKnowledgeBase(category)
  }

  // Index documentation
  if (!category || category === 'docs' || category === 'documentation') {
    await indexDocumentation()
  }

  // Index platform features
  if (!category || category === 'features') {
    await indexPlatformFeatures()
  }

  console.log('\n✨ All done! Knowledge base is ready.\n')
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
