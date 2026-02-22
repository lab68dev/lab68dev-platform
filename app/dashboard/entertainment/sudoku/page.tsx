"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy } from "lucide-react"
import { getCurrentUser } from "@/lib/features/auth"
import { saveScore } from "@/lib/features/games"

type Cell = {
  value: number
  isFixed: boolean
  isInvalid: boolean
}

type Difficulty = "easy" | "medium" | "hard"

const GRID_SIZE = 9
const BOX_SIZE = 3

export default function SudokuPage() {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [isComplete, setIsComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(getCurrentUser())
    generateNewGame(difficulty)
  }, [])

  // Handle game complete - save to DB
  useEffect(() => {
    if (isComplete && user) {
      // Calculate a "score" for Sudoku: Difficulty multiplier / time
      const basePoints = difficulty === "easy" ? 1000 : difficulty === "medium" ? 3000 : 6000
      const timePenalty = timer * 2
      const finalScore = Math.max(100, basePoints - timePenalty)
      
      saveScore(user.id, "sudoku", finalScore).catch(err => console.error("Score save failed:", err))
    }
  }, [isComplete, user, difficulty, timer])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isComplete])

  function generateSolution(): number[][] {
    const grid: number[][] = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0))
    
    function isValid(grid: number[][], row: number, col: number, num: number): boolean {
      // Check row
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[row][x] === num) return false
      }
      
      // Check column
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[x][col] === num) return false
      }
      
      // Check 3x3 box
      const startRow = row - (row % BOX_SIZE)
      const startCol = col - (col % BOX_SIZE)
      for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
          if (grid[i + startRow][j + startCol] === num) return false
        }
      }
      
      return true
    }
    
    function solve(): boolean {
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (grid[row][col] === 0) {
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
            for (const num of numbers) {
              if (isValid(grid, row, col, num)) {
                grid[row][col] = num
                if (solve()) return true
                grid[row][col] = 0
              }
            }
            return false
          }
        }
      }
      return true
    }
    
    solve()
    return grid
  }

  function generateNewGame(diff: Difficulty) {
    const solution = generateSolution()
    const cellsToRemove = diff === "easy" ? 30 : diff === "medium" ? 40 : 50
    
    const newGrid: Cell[][] = solution.map(row =>
      row.map(val => ({
        value: val,
        isFixed: true,
        isInvalid: false
      }))
    )
    
    // Remove cells
    let removed = 0
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * GRID_SIZE)
      const col = Math.floor(Math.random() * GRID_SIZE)
      if (newGrid[row][col].value !== 0) {
        newGrid[row][col].value = 0
        newGrid[row][col].isFixed = false
        removed++
      }
    }
    
    setGrid(newGrid)
    setIsComplete(false)
    setTimer(0)
    setIsRunning(true)
    setSelectedCell(null)
  }

  function handleCellClick(row: number, col: number) {
    if (!grid[row][col].isFixed && !isComplete) {
      setSelectedCell({ row, col })
    }
  }

  function handleNumberInput(num: number) {
    if (!selectedCell || isComplete) return
    
    const { row, col } = selectedCell
    if (grid[row][col].isFixed) return
    
    const newGrid = grid.map(r => r.map(c => ({ ...c, isInvalid: false })))
    newGrid[row][col].value = num
    
    // Check if valid
    const isValid = checkValid(newGrid, row, col)
    newGrid[row][col].isInvalid = !isValid
    
    setGrid(newGrid)
    
    // Check if complete
    if (checkComplete(newGrid)) {
      setIsComplete(true)
      setIsRunning(false)
    }
  }

  function checkValid(grid: Cell[][], row: number, col: number): boolean {
    const num = grid[row][col].value
    if (num === 0) return true
    
    // Check row
    for (let x = 0; x < GRID_SIZE; x++) {
      if (x !== col && grid[row][x].value === num) return false
    }
    
    // Check column
    for (let x = 0; x < GRID_SIZE; x++) {
      if (x !== row && grid[x][col].value === num) return false
    }
    
    // Check 3x3 box
    const startRow = row - (row % BOX_SIZE)
    const startCol = col - (col % BOX_SIZE)
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        const r = i + startRow
        const c = j + startCol
        if ((r !== row || c !== col) && grid[r][c].value === num) return false
      }
    }
    
    return true
  }

  function checkComplete(grid: Cell[][]): boolean {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col].value === 0 || !checkValid(grid, row, col)) {
          return false
        }
      }
    }
    return true
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
        <h1 className="text-4xl font-bold mb-2">Sudoku</h1>
        <p className="text-muted-foreground">Fill the grid so each row, column, and 3×3 box contains 1-9</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => { setDifficulty("easy"); generateNewGame("easy") }}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              difficulty === "easy" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => { setDifficulty("medium"); generateNewGame("medium") }}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              difficulty === "medium" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => { setDifficulty("hard"); generateNewGame("hard") }}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              difficulty === "hard" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            Hard
          </button>
        </div>
        
        <button
          onClick={() => generateNewGame(difficulty)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90"
        >
          New Game
        </button>

        <div className="ml-auto text-lg font-mono font-bold">
          ⏱️ {formatTime(timer)}
        </div>
      </div>

      {/* Game Grid */}
      <div className="mb-6 inline-block border-4 border-border rounded-lg overflow-hidden bg-card">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <button
                key={colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  w-12 h-12 border flex items-center justify-center font-bold text-lg
                  transition-all
                  ${cell.isFixed ? "bg-muted cursor-not-allowed" : "bg-background hover:bg-muted/50 cursor-pointer"}
                  ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? "ring-2 ring-primary" : ""}
                  ${cell.isInvalid ? "text-red-500" : cell.isFixed ? "text-foreground" : "text-primary"}
                  ${colIndex % 3 === 2 && colIndex !== 8 ? "border-r-2 border-r-border" : "border-r-border/30"}
                  ${rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-2 border-b-border" : "border-b-border/30"}
                `}
                disabled={cell.isFixed || isComplete}
              >
                {cell.value !== 0 ? cell.value : ""}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Number Pad */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Select Number</h3>
        <div className="grid grid-cols-9 gap-2 max-w-md">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              disabled={!selectedCell || isComplete}
              className="w-12 h-12 border border-border bg-card rounded font-bold text-lg hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {num}
            </button>
          ))}
        </div>
        <button
          onClick={() => selectedCell && handleNumberInput(0)}
          disabled={!selectedCell || isComplete}
          className="mt-2 px-4 py-2 border border-border bg-card rounded font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Cell
        </button>
      </div>

      {/* Complete Message */}
      {isComplete && (
        <div className="p-6 border border-primary bg-primary/10 rounded-lg">
          <h2 className="text-2xl font-bold text-primary mb-2">🎉 Congratulations!</h2>
          <p className="text-muted-foreground">
            You completed the {difficulty} puzzle in {formatTime(timer)}!
          </p>
        </div>
      )}
    </div>
  )
}
