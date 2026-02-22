import { createClient } from '@/lib/database/supabase-client'

export async function saveScore(userId: string, game: string, score: number) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('game_scores')
        .insert({
            user_id: userId,
            game,
            score,
            created_at: new Date().toISOString()
        })
        .select()
        .single()

    if (error) {
        console.error('Error saving game score:', error)
        throw error
    }

    return data
}

export async function getTopScores(game?: string, limit = 10) {
    const supabase = createClient()

    let query = supabase
        .from('game_scores')
        .select(`
      id,
      game,
      score,
      created_at,
      profiles:user_id (id, name, avatar)
    `)
        .order('score', { ascending: false })
        .limit(limit)

    if (game) {
        query = query.eq('game', game)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching top scores:', error)
        return []
    }

    return data || []
}

export async function getUserBestScores(userId: string) {
    const supabase = createClient()

    // Get max score per game for this user
    const { data, error } = await supabase
        .from('game_scores')
        .select('game, score')
        .eq('user_id', userId)
        .order('game')

    if (error) {
        console.error('Error fetching user best scores:', error)
        return []
    }

    // Manually group by game to find max because Supabase JS client doesn't support complex group-by well without RPC
    const bestScores: Record<string, number> = {}
    data.forEach(item => {
        if (!bestScores[item.game] || item.score > bestScores[item.game]) {
            bestScores[item.game] = item.score
        }
    })

    return bestScores
}
