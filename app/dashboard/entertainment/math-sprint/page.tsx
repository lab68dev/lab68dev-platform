"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Trophy } from "lucide-react"
import { getCurrentUser } from "@/lib/features/auth"
import { saveScore } from "@/lib/features/games"

type Operation = "+" | "-" | "×" | "÷" | "^" | "√" | "%" | "log"
type Difficulty = "easy" | "medium" | "hard" | "engineering"

type Question = {
  num1: number
  num2: number
  operation: Operation
  answer: number
  display?: string
}

export default function MathSprintPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameDuration, setGameDuration] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [user, setUser] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUser(getCurrentUser())
    
    const savedHighScore = localStorage.getItem("mathSprintHighScore")
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("mathSprintHighScore", score.toString())
    }
  }, [score, highScore])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false)
            setGameOver(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft])

  // Handle game over - save to DB
  useEffect(() => {
    if (gameOver && score > 0 && user) {
      saveScore(user.id, "math", score).catch(err => console.error("Score save failed:", err))
    }
  }, [gameOver, score, user])

  function generateQuestion(): Question {
    const operations: Operation[] = ["+", "-", "×"]
    if (difficulty === "hard") {
      operations.push("÷")
    }
    if (difficulty === "engineering") {
      operations.push("^", "√", "%", "log")
    }
    
    const operation = operations[Math.floor(Math.random() * operations.length)]
    let num1: number, num2: number, answer: number, display: string | undefined

    switch (difficulty) {
      case "easy":
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 10) + 1
        break
      case "medium":
        num1 = Math.floor(Math.random() * 20) + 1
        num2 = Math.floor(Math.random() * 20) + 1
        break
      case "hard":
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        break
      case "engineering":
        num1 = Math.floor(Math.random() * 100) + 1
        num2 = Math.floor(Math.random() * 20) + 1
        break
    }

    // Calculate answer based on operation
    if (operation === "÷") {
      // Ensure clean division
      num2 = Math.floor(Math.random() * 10) + 1
      answer = Math.floor(Math.random() * 10) + 1
      num1 = num2 * answer
    } else if (operation === "-") {
      // Ensure positive result
      if (num1 < num2) [num1, num2] = [num2, num1]
      answer = num1 - num2
    } else if (operation === "×") {
      answer = num1 * num2
    } else if (operation === "+") {
      answer = num1 + num2
    } else if (operation === "^") {
      // Power: limit to small exponents
      num2 = Math.floor(Math.random() * 4) + 2 // 2-5
      num1 = Math.floor(Math.random() * 10) + 2 // 2-11
      answer = Math.round(Math.pow(num1, num2))
      display = `${num1}^${num2}`
    } else if (operation === "√") {
      // Square root: ensure perfect squares
      const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400]
      num1 = perfectSquares[Math.floor(Math.random() * perfectSquares.length)]
      num2 = 0 // Not used
      answer = Math.sqrt(num1)
      display = `√${num1}`
    } else if (operation === "%") {
      // Modulo
      num1 = Math.floor(Math.random() * 100) + 10
      num2 = Math.floor(Math.random() * 9) + 2
      answer = num1 % num2
    } else if (operation === "log") {
      // Logarithm base 10: use powers of 10 for clean answers
      const powers = [10, 100, 1000, 10000]
      num1 = powers[Math.floor(Math.random() * powers.length)]
      num2 = 10 // base
      answer = Math.log10(num1)
      display = `log₁₀(${num1})`
    } else {
      answer = num1 + num2
    }

    return { num1, num2, operation, answer, display }
  }

  function startGame() {
    setCurrentQuestion(generateQuestion())
    setScore(0)
    setQuestionsAnswered(0)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setTimeLeft(gameDuration)
    setIsPlaying(true)
    setGameOver(false)
    setStreak(0)
    setUserAnswer("")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentQuestion || !isPlaying || userAnswer === "") return

    const userNum = parseInt(userAnswer)
    const isCorrect = userNum === currentQuestion.answer

    if (isCorrect) {
      const points = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : difficulty === "hard" ? 30 : 50
      const bonusPoints = Math.min(streak * 5, 50) // Max 50 bonus
      setScore(prev => prev + points + bonusPoints)
      setCorrectAnswers(prev => prev + 1)
      setStreak(prev => {
        const newStreak = prev + 1
        if (newStreak > bestStreak) setBestStreak(newStreak)
        return newStreak
      })
    } else {
      setWrongAnswers(prev => prev + 1)
      setStreak(0)
    }

    setQuestionsAnswered(prev => prev + 1)
    setCurrentQuestion(generateQuestion())
    setUserAnswer("")
    inputRef.current?.focus()
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function changeDifficulty(newDiff: Difficulty) {
    setDifficulty(newDiff)
    if (isPlaying) {
      setCurrentQuestion(generateQuestion())
    }
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
        <h1 className="text-4xl font-bold mb-2">Math Sprint</h1>
        <p className="text-muted-foreground">Solve as many math problems as you can in 60 seconds!</p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Difficulty Selection */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => changeDifficulty("easy")}
            disabled={isPlaying}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              difficulty === "easy" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            } disabled:opacity-50`}
          >
            Easy (1-10)
          </button>
          <button
            onClick={() => changeDifficulty("medium")}
            disabled={isPlaying}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              difficulty === "medium" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            } disabled:opacity-50`}
          >
            Medium (1-20)
          </button>
          <button
            onClick={() => changeDifficulty("hard")}
            disabled={isPlaying}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              difficulty === "hard" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            } disabled:opacity-50`}
          >
            Hard (1-50)
          </button>
          <button
            onClick={() => changeDifficulty("engineering")}
            disabled={isPlaying}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              difficulty === "engineering" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            } disabled:opacity-50`}
          >
            🔬 Engineering
          </button>
        </div>

        {/* Time Selection */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground">Time Limit:</span>
          <button
            onClick={() => setGameDuration(60)}
            disabled={isPlaying}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              gameDuration === 60 ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            } disabled:opacity-50`}
          >
            1 min
          </button>
          <button
            onClick={() => setGameDuration(120)}
            disabled={isPlaying}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              gameDuration === 120 ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            } disabled:opacity-50`}
          >
            2 min
          </button>
          <button
            onClick={() => setGameDuration(180)}
            disabled={isPlaying}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              gameDuration === 180 ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            } disabled:opacity-50`}
          >
            3 min
          </button>
          <button
            onClick={() => setGameDuration(300)}
            disabled={isPlaying}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              gameDuration === 300 ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            } disabled:opacity-50`}
          >
            5 min
          </button>
        
          <button
            onClick={startGame}
            className="ml-auto px-6 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90"
          >
            {isPlaying ? "Restart" : "Start Game"}
          </button>

          <div className="text-2xl font-mono font-bold">
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Game Area */}
      {!gameOver && currentQuestion ? (
        <div className="mb-6 border-4 border-border rounded-lg p-8 bg-card">
          <div className="max-w-md mx-auto">
            {/* Question */}
            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-4 flex items-center justify-center gap-4">
                {currentQuestion.display ? (
                  <>
                    <span className="text-primary">{currentQuestion.display}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-foreground">?</span>
                  </>
                ) : currentQuestion.operation === "%" ? (
                  <>
                    <span className="text-primary">{currentQuestion.num1}</span>
                    <span className="text-muted-foreground">mod</span>
                    <span className="text-primary">{currentQuestion.num2}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-foreground">?</span>
                  </>
                ) : (
                  <>
                    <span className="text-primary">{currentQuestion.num1}</span>
                    <span className="text-muted-foreground">{currentQuestion.operation}</span>
                    <span className="text-primary">{currentQuestion.num2}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-foreground">?</span>
                  </>
                )}
              </div>
              
              {difficulty === "engineering" && (
                <div className="text-sm text-muted-foreground mb-2">
                  {currentQuestion.operation === "^" && "Power"}
                  {currentQuestion.operation === "√" && "Square Root"}
                  {currentQuestion.operation === "%" && "Modulo (Remainder)"}
                  {currentQuestion.operation === "log" && "Logarithm Base 10"}
                </div>
              )}
              
              {streak > 0 && (
                <div className="text-lg font-semibold text-primary animate-pulse">
                  🔥 {streak} Streak! +{Math.min(streak * 5, 50)} Bonus
                </div>
              )}
            </div>

            {/* Answer Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={!isPlaying}
                placeholder="Your answer..."
                className="w-full px-6 py-4 text-center text-3xl font-bold border-2 border-border bg-background rounded-lg focus:outline-none focus:ring-4 focus:ring-primary disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={!isPlaying || userAnswer === ""}
                className="w-full px-6 py-4 bg-primary text-primary-foreground text-xl font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Answer
              </button>
            </form>
          </div>
        </div>
      ) : !isPlaying && !gameOver ? (
        <div className="border-4 border-border rounded-lg p-12 bg-card text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🧮</div>
            <h2 className="text-2xl font-bold mb-4">Ready to Sprint?</h2>
            <p className="text-muted-foreground mb-6">
              Select a difficulty level and click "Start Game" to begin!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-primary text-primary-foreground text-xl font-bold rounded-lg hover:bg-primary/90"
            >
              Start Game
            </button>
          </div>
        </div>
      ) : null}

      {/* Game Over */}
      {gameOver && (
        <div className="mb-6 border-4 border-primary rounded-lg p-8 bg-primary/10">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">⏰ Time's Up!</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border border-border bg-card p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              <div className="border border-border bg-card p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary">{questionsAnswered}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="border border-border bg-card p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-500">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="border border-border bg-card p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-500">{wrongAnswers}</div>
                <div className="text-sm text-muted-foreground">Wrong</div>
              </div>
            </div>
            <div className="text-lg mb-4">
              Accuracy: <span className="font-bold text-primary">
                {questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}%
              </span>
            </div>
            {bestStreak > 0 && (
              <div className="text-lg mb-6">
                Best Streak: <span className="font-bold text-primary">🔥 {bestStreak}</span>
              </div>
            )}
            <button
              onClick={startGame}
              className="px-8 py-3 bg-primary text-primary-foreground text-lg font-bold rounded-lg hover:bg-primary/90"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{highScore}</div>
          <div className="text-xs text-muted-foreground">High Score</div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{correctAnswers}</div>
          <div className="text-xs text-muted-foreground">Correct</div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{streak}</div>
          <div className="text-xs text-muted-foreground">Streak</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 border border-border bg-card rounded-lg">
        <h3 className="font-bold mb-3">How to Play</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Solve as many math problems as possible before time runs out</li>
          <li>• <strong>Easy:</strong> 10 points | <strong>Medium:</strong> 20 points | <strong>Hard:</strong> 30 points | <strong>Engineering:</strong> 50 points</li>
          <li>• Build a streak for bonus points (max +50 per question)</li>
          <li>• Wrong answers break your streak</li>
          <li>• Choose time limit: 1, 2, 3, or 5 minutes</li>
          <li>• Press Enter or click Submit to answer</li>
        </ul>
        
        {difficulty === "engineering" && (
          <div className="mt-4 p-4 bg-primary/10 rounded border border-primary">
            <h4 className="font-bold text-primary mb-2">🔬 Engineering Mode Operations:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Powers (^):</strong> Calculate exponentials like 2³ = 8</li>
              <li>• <strong>Square Root (√):</strong> Find the square root of perfect squares</li>
              <li>• <strong>Modulo (%):</strong> Find the remainder after division</li>
              <li>• <strong>Logarithm (log):</strong> Base-10 logarithm of powers of 10</li>
              <li>• <strong>Plus:</strong> Basic arithmetic operations (+, -, ×, ÷)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
