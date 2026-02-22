"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Trophy } from "lucide-react"

type Position = { x: number; y: number }
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

import { getCurrentUser } from "@/lib/features/auth"
import { saveScore } from "@/lib/features/games"

export default function SnakePage() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>("RIGHT")
  const [nextDirection, setNextDirection] = useState<Direction>("RIGHT")
  const [isGameOver, setIsGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [user, setUser] = useState<any>(null)
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem("snakeHighScore")
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
  }, [])

  useEffect(() => {
    // Save high score
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("snakeHighScore", score.toString())
    }
  }, [score, highScore])

  // Handle game over - save to DB
  useEffect(() => {
    if (isGameOver && score > 0 && user) {
      saveScore(user.id, "snake", score).catch(err => console.error("Score save failed:", err))
    }
  }, [isGameOver, score, user])

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection("RIGHT")
    setNextDirection("RIGHT")
    setIsGameOver(false)
    setIsPaused(false)
    setScore(0)
    setSpeed(INITIAL_SPEED)
  }, [generateFood])

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return

    setDirection(nextDirection)

    setSnake(prevSnake => {
      const head = prevSnake[0]
      let newHead: Position

      switch (nextDirection) {
        case "UP":
          newHead = { x: head.x, y: head.y - 1 }
          break
        case "DOWN":
          newHead = { x: head.x, y: head.y + 1 }
          break
        case "LEFT":
          newHead = { x: head.x - 1, y: head.y }
          break
        case "RIGHT":
          newHead = { x: head.x + 1, y: head.y }
          break
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true)
        return prevSnake
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true)
        return prevSnake
      }

      const newSnake = [newHead, ...prevSnake]

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => prev + 10)
        setFood(generateFood(newSnake))
        // Increase speed slightly
        setSpeed(prev => Math.max(50, prev - 5))
        return newSnake
      }

      // Remove tail if no food eaten
      newSnake.pop()
      return newSnake
    })
  }, [nextDirection, isGameOver, isPaused, food, generateFood])

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, speed)
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [moveSnake, speed])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (direction !== "DOWN") setNextDirection("UP")
          e.preventDefault()
          break
        case "ArrowDown":
        case "s":
        case "S":
          if (direction !== "UP") setNextDirection("DOWN")
          e.preventDefault()
          break
        case "ArrowLeft":
        case "a":
        case "A":
          if (direction !== "RIGHT") setNextDirection("LEFT")
          e.preventDefault()
          break
        case "ArrowRight":
        case "d":
        case "D":
          if (direction !== "LEFT") setNextDirection("RIGHT")
          e.preventDefault()
          break
        case " ":
          setIsPaused(prev => !prev)
          e.preventDefault()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [direction, isGameOver])

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
        <h1 className="text-4xl font-bold mb-2">Snake</h1>
        <p className="text-muted-foreground">Classic snake game - eat food and grow!</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90"
        >
          New Game
        </button>

        <button
          onClick={() => setIsPaused(prev => !prev)}
          disabled={isGameOver}
          className="px-4 py-2 bg-muted rounded font-medium hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>

        <div className="flex gap-4 ml-auto">
          <div className="text-lg font-mono font-bold">
            🎯 Score: {score}
          </div>
          <div className="text-lg font-mono font-bold">
            🏆 High: {highScore}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="mb-6 inline-block border-4 border-border rounded-lg overflow-hidden bg-card relative">
        <div
          className="relative bg-background"
          style={{
            width: `${GRID_SIZE * CELL_SIZE}px`,
            height: `${GRID_SIZE * CELL_SIZE}px`,
          }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 grid" style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
              <div key={i} className="border border-border/10" />
            ))}
          </div>

          {/* Food */}
          <div
            className="absolute bg-red-500 rounded-full animate-pulse"
            style={{
              left: `${food.x * CELL_SIZE}px`,
              top: `${food.y * CELL_SIZE}px`,
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute rounded ${
                index === 0 
                  ? "bg-primary z-10" 
                  : "bg-primary/80"
              }`}
              style={{
                left: `${segment.x * CELL_SIZE}px`,
                top: `${segment.y * CELL_SIZE}px`,
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
              }}
            >
              {index === 0 && (
                <div className="w-full h-full flex items-center justify-center text-xs">
                  {direction === "UP" && "↑"}
                  {direction === "DOWN" && "↓"}
                  {direction === "LEFT" && "←"}
                  {direction === "RIGHT" && "→"}
                </div>
              )}
            </div>
          ))}

          {/* Game Over Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
                <p className="text-xl text-white mb-4">Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}

          {/* Pause Overlay */}
          {isPaused && !isGameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-2">Paused</h2>
                <p className="text-white">Press SPACE to continue</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="mb-6 md:hidden">
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          <div />
          <button
            onClick={() => direction !== "DOWN" && setNextDirection("UP")}
            className="p-4 bg-muted rounded font-bold text-2xl hover:bg-muted/80 active:bg-primary active:text-primary-foreground"
          >
            ↑
          </button>
          <div />
          <button
            onClick={() => direction !== "RIGHT" && setNextDirection("LEFT")}
            className="p-4 bg-muted rounded font-bold text-2xl hover:bg-muted/80 active:bg-primary active:text-primary-foreground"
          >
            ←
          </button>
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="p-4 bg-muted rounded font-bold text-sm hover:bg-muted/80"
          >
            {isPaused ? "▶" : "⏸"}
          </button>
          <button
            onClick={() => direction !== "LEFT" && setNextDirection("RIGHT")}
            className="p-4 bg-muted rounded font-bold text-2xl hover:bg-muted/80 active:bg-primary active:text-primary-foreground"
          >
            →
          </button>
          <div />
          <button
            onClick={() => direction !== "UP" && setNextDirection("DOWN")}
            className="p-4 bg-muted rounded font-bold text-2xl hover:bg-muted/80 active:bg-primary active:text-primary-foreground"
          >
            ↓
          </button>
          <div />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 max-w-md">
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{snake.length}</div>
          <div className="text-xs text-muted-foreground">Length</div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{highScore}</div>
          <div className="text-xs text-muted-foreground">High Score</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 border border-border bg-card rounded-lg max-w-md">
        <h3 className="font-bold mb-2">Controls</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Arrow Keys or WASD to move</li>
          <li>• SPACE to pause/resume</li>
          <li>• Eat red food to grow and score points</li>
          <li>• Don't hit the walls or yourself!</li>
        </ul>
      </div>
    </div>
  )
}
