/**
 * RAG (Retrieval-Augmented Generation) Service
 * Provides document embedding, storage, and retrieval for AI context enhancement
 */

import { pipeline, env } from '@xenova/transformers'
import { createClient } from '@/lib/database/supabase-client'

// Use local models for embeddings (works in browser and server)
env.allowLocalModels = true

// Type definitions
export interface Document {
  id?: string
  content: string
  metadata?: Record<string, any>
  category?: string
  source?: string
  title?: string
}

export interface SearchResult {
  id: string
  content: string
  metadata: Record<string, any>
  similarity: number
  category: string
  source: string
  title: string
}

/**
 * RAG Service for embedding and retrieving documents
 */
class RAGService {
  private embeddingPipeline: any = null
  private isInitialized = false

  /**
   * Initialize the embedding model (lazy loading)
   */
  private async initializeEmbeddings() {
    if (this.isInitialized) return

    console.log('🔧 Initializing RAG embeddings model...')
    
    try {
      // Use Xenova's feature-extraction pipeline with all-MiniLM-L6-v2
      // This model produces 384-dimensional embeddings
      this.embeddingPipeline = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      )
      
      this.isInitialized = true
      console.log('✅ RAG embeddings model initialized')
    } catch (error) {
      console.error('❌ Failed to initialize embeddings:', error)
      throw new Error('Failed to initialize RAG embeddings model')
    }
  }

  /**
   * Generate embedding vector for text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    await this.initializeEmbeddings()

    try {
      // Generate embedding
      const output = await this.embeddingPipeline(text, {
        pooling: 'mean',
        normalize: true,
      })

      // Convert to regular array
      const embedding = Array.from(output.data) as number[]
      
      return embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw new Error('Failed to generate embedding')
    }
  }

  /**
   * Add a document to the knowledge base
   */
  async addDocument(document: Document): Promise<string> {
    try {
      const supabase = createClient()

      // Generate embedding for the document
      const embedding = await this.generateEmbedding(document.content)

      // Insert into database
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          content: document.content,
          metadata: document.metadata || {},
          embedding: embedding,
          category: document.category || 'general',
          source: document.source || 'manual',
          title: document.title || 'Untitled',
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error adding document:', error)
        throw new Error(`Failed to add document: ${error.message}`)
      }

      console.log(`✅ Document added with ID: ${data.id}`)
      return data.id
    } catch (error) {
      console.error('Error in addDocument:', error)
      throw error
    }
  }

  /**
   * Add multiple documents in batch
   */
  async addDocuments(documents: Document[]): Promise<string[]> {
    try {
      const supabase = createClient()

      // Generate embeddings for all documents
      console.log(`📚 Processing ${documents.length} documents...`)
      const documentsWithEmbeddings = await Promise.all(
        documents.map(async (doc) => ({
          content: doc.content,
          metadata: doc.metadata || {},
          embedding: await this.generateEmbedding(doc.content),
          category: doc.category || 'general',
          source: doc.source || 'manual',
          title: doc.title || 'Untitled',
        }))
      )

      // Insert all documents
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert(documentsWithEmbeddings)
        .select('id')

      if (error) {
        console.error('Error adding documents:', error)
        throw new Error(`Failed to add documents: ${error.message}`)
      }

      const ids = data.map((item) => item.id)
      console.log(`✅ Added ${ids.length} documents`)
      return ids
    } catch (error) {
      console.error('Error in addDocuments:', error)
      throw error
    }
  }

  /**
   * Search for relevant documents using semantic similarity
   */
  async searchDocuments(
    query: string,
    options: {
      limit?: number
      threshold?: number
      category?: string
    } = {}
  ): Promise<SearchResult[]> {
    try {
      const supabase = createClient()

      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query)

      // Search using the match_documents function
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: options.threshold || 0.7,
        match_count: options.limit || 5,
        filter_category: options.category || null,
      })

      if (error) {
        console.error('Error searching documents:', error)
        throw new Error(`Search failed: ${error.message}`)
      }

      console.log(`🔍 Found ${data.length} relevant documents`)
      return data as SearchResult[]
    } catch (error) {
      console.error('Error in searchDocuments:', error)
      throw error
    }
  }

  /**
   * Get context for RAG-enhanced chat
   * Returns formatted context string to prepend to AI prompts
   */
  async getContextForQuery(
    query: string,
    options?: {
      limit?: number
      threshold?: number
      category?: string
    }
  ): Promise<string> {
    try {
      const results = await this.searchDocuments(query, options)

      if (results.length === 0) {
        return ''
      }

      // Format context with sources
      const contextParts = results.map((result, index) => {
        return `[Context ${index + 1}] (from ${result.source}, similarity: ${(result.similarity * 100).toFixed(1)}%)\n${result.content}`
      })

      const context = contextParts.join('\n\n')
      
      return `Based on the following context from the Lab68 Dev Platform documentation:\n\n${context}\n\n---\n\n`
    } catch (error) {
      console.error('Error getting context:', error)
      return '' // Return empty context on error, don't break the chat
    }
  }

  /**
   * Delete a document by ID
   */
  async deleteDocument(id: string): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete document: ${error.message}`)
    }

    console.log(`🗑️ Document ${id} deleted`)
  }

  /**
   * Clear all documents (use with caution!)
   */
  async clearAllDocuments(category?: string): Promise<void> {
    const supabase = createClient()

    let query = supabase.from('knowledge_base').delete()

    if (category) {
      query = query.eq('category', category)
    } else {
      query = query.neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    }

    const { error } = await query

    if (error) {
      throw new Error(`Failed to clear documents: ${error.message}`)
    }

    console.log(`🗑️ Cleared documents${category ? ` in category: ${category}` : ''}`)
  }
}

// Export singleton instance
export const ragService = new RAGService()

// Export the class for testing
export { RAGService }
