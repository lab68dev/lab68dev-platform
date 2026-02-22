"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Trophy } from "lucide-react"
import { getCurrentUser } from "@/lib/features/auth"
import { saveScore } from "@/lib/features/games"

type Cell = string | null
type Position = { x: number; y: number }

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const CELL_SIZE = 30

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
}

const COLORS = {
  I: "#00f0f0",
  O: "#f0f000",
  T: "#a000f0",
  S: "#00f000",
  Z: "#f00000",
  J: "#0000f0",
  L: "#f0a000"
}

type ShapeType = keyof typeof SHAPES

export default function TetrisPage() {
  const [board, setBoard] = useState<Cell[][]>(
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
  )
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][]
    type: ShapeType
    position: Position
  } | null>(null)
  const [nextPiece, setNextPiece] = useState<ShapeType | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [user, setUser] = useState<any>(null)

  const gameLoopRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const dropSpeed = Math.max(100, 1000 - (level - 1) * 100)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    const savedHighScore = localStorage.getItem("tetrisHighScore")
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
    startNewGame()
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("tetrisHighScore", score.toString())
    }
  }, [score, highScore])

  useEffect(() => {
    if (isGameOver && score > 0 && user) {
      saveScore(user.id, "tetris", score).catch(err => console.error("Score save failed:", err))
    }
  }, [isGameOver, score, user])

  const getRandomShape = useCallback((): ShapeType => {
    const shapes = Object.keys(SHAPES) as ShapeType[]
    return shapes[Math.floor(Math.random() * shapes.length)]
  }, [])

  const createPiece = useCallback((type: ShapeType) => {
    return {
      shape: SHAPES[type],
      type,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }
    }
  }, [])

  const startNewGame = useCallback(() => {
    const newBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
    setBoard(newBoard)
    const firstPiece = getRandomShape()
    const secondPiece = getRandomShape()
    setCurrentPiece(createPiece(firstPiece))
    setNextPiece(secondPiece)
    setScore(0)
    setLevel(1)
    setLines(0)
    setIsGameOver(false)
    setIsPaused(false)
  }, [getRandomShape, createPiece])

  const checkCollision = useCallback((
    piece: { shape: number[][]; position: Position },
    board: Cell[][],
    offset: Position = { x: 0, y: 0 }
  ): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.position.x + x + offset.x
          const newY = piece.position.y + y + offset.y

          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true
          }
        }
      }
    }
    return false
  }, [])

  const mergePiece = useCallback((
    piece: { shape: number[][]; type: ShapeType; position: Position },
    board: Cell[][]
  ): Cell[][] => {
    const newBoard = board.map(row => [...row])
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = piece.position.y + y
          const boardX = piece.position.x + x
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.type
          }
        }
      })
    })
    return newBoard
  }, [])

  const clearLines = useCallback((board: Cell[][]): { newBoard: Cell[][]; linesCleared: number } => {
    let linesCleared = 0
    const newBoard = board.filter(row => {
      if (row.every(cell => cell !== null)) {
        linesCleared++
        return false
      }
      return true
    })

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null))
    }

    return { newBoard, linesCleared }
  }, [])

  const movePiece = useCallback((offset: Position) => {
    if (!currentPiece || isGameOver || isPaused) return

    if (!checkCollision(currentPiece, board, offset)) {
      setCurrentPiece({
        ...currentPiece,
        position: {
          x: currentPiece.position.x + offset.x,
          y: currentPiece.position.y + offset.y
        }
      })
    } else if (offset.y > 0) {
      // Piece has landed
      const newBoard = mergePiece(currentPiece, board)
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)
      
      setBoard(clearedBoard)
      setLines(prev => prev + linesCleared)
      setScore(prev => prev + linesCleared * 100 * level)
      setLevel(Math.floor(lines / 10) + 1)

      if (nextPiece) {
        const newPiece = createPiece(nextPiece)
        if (checkCollision(newPiece, clearedBoard)) {
          setIsGameOver(true)
        } else {
          setCurrentPiece(newPiece)
          setNextPiece(getRandomShape())
        }
      }
    }
  }, [currentPiece, board, isGameOver, isPaused, checkCollision, mergePiece, clearLines, nextPiece, createPiece, getRandomShape, level, lines])

  const rotatePiece = useCallback(() => {
    if (!currentPiece || isGameOver || isPaused) return

    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    )

    const rotatedPiece = { ...currentPiece, shape: rotated }

    if (!checkCollision(rotatedPiece, board)) {
      setCurrentPiece(rotatedPiece)
    }
  }, [currentPiece, board, isGameOver, isPaused, checkCollision])

  const dropPiece = useCallback(() => {
    if (!currentPiece || isGameOver || isPaused) return

    let offset = 1
    while (!checkCollision(currentPiece, board, { x: 0, y: offset })) {
      offset++
    }
    movePiece({ x: 0, y: offset - 1 })
  }, [currentPiece, board, isGameOver, isPaused, checkCollision, movePiece])

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      gameLoopRef.current = setInterval(() => {
        movePiece({ x: 0, y: 1 })
      }, dropSpeed)
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [movePiece, dropSpeed, isGameOver, isPaused])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          movePiece({ x: -1, y: 0 })
          e.preventDefault()
          break
        case "ArrowRight":
        case "d":
        case "D":
          movePiece({ x: 1, y: 0 })
          e.preventDefault()
          break
        case "ArrowDown":
        case "s":
        case "S":
          movePiece({ x: 0, y: 1 })
          e.preventDefault()
          break
        case "ArrowUp":
        case "w":
        case "W":
          rotatePiece()
          e.preventDefault()
          break
        case " ":
          dropPiece()
          e.preventDefault()
          break
        case "p":
        case "P":
          setIsPaused(prev => !prev)
          e.preventDefault()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [movePiece, rotatePiece, dropPiece, isGameOver])

  const renderCell = (cell: Cell, x: number, y: number) => {
    let isPieceCell = false
    let pieceColor = ""

    if (currentPiece) {
      currentPiece.shape.forEach((row, py) => {
        row.forEach((cellValue, px) => {
          if (cellValue && 
              currentPiece.position.x + px === x && 
              currentPiece.position.y + py === y) {
            isPieceCell = true
            pieceColor = COLORS[currentPiece.type]
          }
        })
      })
    }

    const color = isPieceCell ? pieceColor : cell ? COLORS[cell as ShapeType] : "transparent"

    return (
      <div
        key={`${x}-${y}`}
        className="border border-border/30"
        style={{
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          backgroundColor: color,
        }}
      />
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
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
        <h1 className="text-4xl font-bold mb-2">Tetris</h1>
        <p className="text-muted-foreground">Classic falling blocks puzzle game</p>
      </div>

      <div className="flex gap-6 flex-wrap">
        {/* Game Board */}
        <div>
          <div className="mb-4 flex gap-2">
            <button
              onClick={startNewGame}
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
          </div>

          <div className="inline-block border-4 border-border rounded-lg overflow-hidden bg-background relative">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
                width: `${BOARD_WIDTH * CELL_SIZE}px`,
                height: `${BOARD_HEIGHT * CELL_SIZE}px`,
              }}
            >
              {board.map((row, y) =>
                row.map((cell, x) => renderCell(cell, x, y))
              )}
            </div>

            {/* Game Over Overlay */}
            {isGameOver && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
                  <p className="text-xl text-white mb-4">Score: {score}</p>
                  <button
                    onClick={startNewGame}
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
                  <p className="text-white">Press P to continue</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="flex-1 min-w-[200px]">
          {/* Stats */}
          <div className="space-y-4 mb-6">
            <div className="border border-border bg-card p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Score</div>
              <div className="text-3xl font-bold text-primary">{score}</div>
            </div>
            <div className="border border-border bg-card p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">High Score</div>
              <div className="text-2xl font-bold">{highScore}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Level</div>
                <div className="text-2xl font-bold text-primary">{level}</div>
              </div>
              <div className="border border-border bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Lines</div>
                <div className="text-2xl font-bold text-primary">{lines}</div>
              </div>
            </div>
          </div>

          {/* Next Piece */}
          <div className="border border-border bg-card p-4 rounded-lg mb-6">
            <div className="text-sm font-semibold mb-2 text-muted-foreground">Next Piece</div>
            {nextPiece && (
              <div className="flex justify-center">
                <div className="grid gap-0.5 bg-background p-2 rounded">
                  {SHAPES[nextPiece].map((row, y) => (
                    <div key={y} className="flex gap-0.5">
                      {row.map((cell, x) => (
                        <div
                          key={x}
                          className="border border-border/30"
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: cell ? COLORS[nextPiece] : "transparent",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="border border-border bg-card p-4 rounded-lg">
            <h3 className="font-bold mb-2">Controls</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ← → or A/D: Move left/right</li>
              <li>• ↓ or S: Move down faster</li>
              <li>• ↑ or W: Rotate piece</li>
              <li>• SPACE: Drop piece instantly</li>
              <li>• P: Pause/Resume</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
