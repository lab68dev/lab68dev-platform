"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy } from "lucide-react"
import { getCurrentUser } from "@/lib/features/auth"
import { saveScore } from "@/lib/features/games"

type Tile = number | null

export default function SlidingPuzzlePage() {
  const [gridSize, setGridSize] = useState(3)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(getCurrentUser())
    initializeGame(gridSize)
  }, [])

  // Handle game complete - save to DB
  useEffect(() => {
    if (isComplete && user) {
      // Calculate score for Sliding Puzzle: (GridSize^4) / (Moves + Time)
      // Example: 3x3 (size 3) with 50 moves and 60 seconds = 81 / 110 * 1000 = ~736 points
      const basePoints = Math.pow(gridSize, 4) * 10
      const movePenalty = moves * 2
      const timePenalty = timer
      const finalScore = Math.max(10, Math.floor(basePoints * 100 / (movePenalty + timePenalty + 1)))
      
      saveScore(user.id, "sliding", finalScore).catch(err => console.error("Score save failed:", err))
    }
  }, [isComplete, user, gridSize, moves, timer])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isComplete])

  function initializeGame(size: number) {
    const totalTiles = size * size
    const initialTiles: Tile[] = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1)
    initialTiles.push(null) // Empty space
    
    // Shuffle tiles
    const shuffled = shuffleTiles(initialTiles, size)
    setTiles(shuffled)
    setMoves(0)
    setIsComplete(false)
    setTimer(0)
    setIsRunning(true)
  }

  function shuffleTiles(tiles: Tile[], size: number): Tile[] {
    const shuffled = [...tiles]
    const totalMoves = size * size * 10 // Enough moves to shuffle
    
    for (let i = 0; i < totalMoves; i++) {
      const emptyIndex = shuffled.indexOf(null)
      const validMoves = getValidMoves(emptyIndex, size)
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
      
      // Swap
      ;[shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]]
    }
    
    return shuffled
  }

  function getValidMoves(emptyIndex: number, size: number): number[] {
    const row = Math.floor(emptyIndex / size)
    const col = emptyIndex % size
    const moves: number[] = []
    
    // Up
    if (row > 0) moves.push(emptyIndex - size)
    // Down
    if (row < size - 1) moves.push(emptyIndex + size)
    // Left
    if (col > 0) moves.push(emptyIndex - 1)
    // Right
    if (col < size - 1) moves.push(emptyIndex + 1)
    
    return moves
  }

  function handleTileClick(index: number) {
    if (isComplete) return
    
    const emptyIndex = tiles.indexOf(null)
    const validMoves = getValidMoves(emptyIndex, gridSize)
    
    if (validMoves.includes(index)) {
      const newTiles = [...tiles]
      ;[newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]]
      setTiles(newTiles)
      setMoves(prev => prev + 1)
      
      // Check if solved
      if (checkComplete(newTiles)) {
        setIsComplete(true)
        setIsRunning(false)
      }
    }
  }

  function checkComplete(tiles: Tile[]): boolean {
    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] !== i + 1) return false
    }
    return tiles[tiles.length - 1] === null
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function changeGridSize(size: number) {
    setGridSize(size)
    initializeGame(size)
  }

  const tileSize = gridSize === 3 ? 100 : gridSize === 4 ? 80 : 64

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/dashboard/entertainment" className="text-primary hover:underline">
            ← Back to Games
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <Link href="/dashboard/entertainment/leaderboard" className="text-primary hover:underline flex items-center gap-1">
            <Trophy className="h-3 w-3" /> Hall of Fame
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-2">Sliding Puzzle</h1>
        <p className="text-muted-foreground">Arrange the tiles in numerical order</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => changeGridSize(3)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              gridSize === 3 ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            3×3
          </button>
          <button
            onClick={() => changeGridSize(4)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              gridSize === 4 ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            4×4
          </button>
          <button
            onClick={() => changeGridSize(5)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              gridSize === 5 ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            5×5
          </button>
        </div>
        
        <button
          onClick={() => initializeGame(gridSize)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90"
        >
          New Game
        </button>

        <div className="flex gap-4 ml-auto">
          <div className="text-lg font-mono font-bold">
            🎯 Moves: {moves}
          </div>
          <div className="text-lg font-mono font-bold">
            ⏱️ {formatTime(timer)}
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div 
        className="mb-6 inline-block border-4 border-border rounded-lg p-2 bg-card"
        style={{ 
          width: `${tileSize * gridSize + 16}px`,
          height: `${tileSize * gridSize + 16}px`
        }}
      >
        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => handleTileClick(index)}
              disabled={tile === null || isComplete}
              className={`
                rounded font-bold text-xl transition-all
                ${tile === null 
                  ? "bg-transparent cursor-default" 
                  : "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground hover:scale-105 shadow-lg cursor-pointer"}
                ${isComplete ? "opacity-75" : ""}
              `}
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
              }}
            >
              {tile}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 max-w-md">
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{gridSize}×{gridSize}</div>
          <div className="text-xs text-muted-foreground">Grid Size</div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{moves}</div>
          <div className="text-xs text-muted-foreground">Moves</div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{formatTime(timer)}</div>
          <div className="text-xs text-muted-foreground">Time</div>
        </div>
      </div>

      {/* Complete Message */}
      {isComplete && (
        <div className="p-6 border border-primary bg-primary/10 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-primary mb-2">🎉 Puzzle Solved!</h2>
          <p className="text-muted-foreground">
            Completed in {moves} moves and {formatTime(timer)}!
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-6 border border-border bg-card rounded-lg max-w-md">
        <h3 className="font-bold mb-2">How to Play</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Click on tiles adjacent to the empty space to move them</li>
          <li>• Arrange all tiles in numerical order</li>
          <li>• Complete the puzzle in the fewest moves possible</li>
        </ul>
      </div>
    </div>
  )
}
