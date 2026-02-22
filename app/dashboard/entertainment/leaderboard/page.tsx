"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, Medal, Tv, Gamepad2, User, ChevronRight } from "lucide-react"
import { getTopScores } from "@/lib/features/games"
import { getTranslations, getUserLanguage } from "@/lib/config"

export default function LeaderboardPage() {
  const [topScores, setTopScores] = useState<any[]>([])
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const t = getTranslations(getUserLanguage())

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true)
      const scores = await getTopScores(selectedGame || undefined)
      setTopScores(scores)
      setLoading(false)
    }
    fetchScores()
  }, [selectedGame])

  const games = [
    { id: "tetris", name: "Tetris" },
    { id: "snake", name: "Snake" },
    { id: "sudoku", name: "Sudoku" },
    { id: "typing", name: "Typing" },
    { id: "scramble", name: "Word Scramble" },
    { id: "math", name: "Math Sprint" },
    { id: "sliding", name: "Sliding Puzzle" }
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase italic">Hall of Fame</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The best performers across all lab68dev entertainment modules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4 px-2">Filter by Game</h3>
          <button
            onClick={() => setSelectedGame(null)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
              selectedGame === null 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-transparent hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-4 w-4" />
              <span className="font-bold">All Games</span>
            </div>
            {selectedGame === null && <ChevronRight className="h-4 w-4" />}
          </button>
          
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                selectedGame === game.id 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-transparent hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                  {game.name[0]}
                </div>
                <span className="font-bold">{game.name}</span>
              </div>
              {selectedGame === game.id && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>

        {/* Score List */}
        <div className="lg:col-span-3">
          <div className="bg-card border-2 border-border p-6 rounded-xl shadow-xl">
            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground font-mono">Loading telemetry data...</p>
              </div>
            ) : topScores.length === 0 ? (
              <div className="py-20 text-center">
                <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No records found for this entry.</p>
                <Link href="/dashboard/entertainment" className="text-primary hover:underline mt-4 inline-block">
                  Be the first to score →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {topScores.map((record, index) => (
                  <div 
                    key={record.id} 
                    className="group flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 border-2 border-transparent hover:border-primary/20 rounded-lg transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center font-black text-xl rounded italic ${
                        index === 0 ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" :
                        index === 1 ? "bg-gray-400 text-black" :
                        index === 2 ? "bg-amber-700 text-white" :
                        "text-muted-foreground"
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-border overflow-hidden flex items-center justify-center">
                          {record.profiles?.avatar ? (
                            <img src={record.profiles.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-lg group-hover:text-primary transition-colors">
                            {record.profiles?.name || "Unknown Pilot"}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 uppercase tracking-tighter font-bold">
                            <span className="text-primary">{record.game.toUpperCase()}</span>
                            <span>•</span>
                            <span>{new Date(record.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black font-mono tracking-tighter text-primary">
                        {record.score.toLocaleString()}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Points</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground uppercase tracking-widest font-bold px-2">
            <span>Global Data Streams</span>
            <span>Refreshed Real-Time</span>
          </div>
        </div>
      </div>
    </div>
  )
}
