"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Zap, Trophy, RotateCcw, Home, Target, Keyboard } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/features/auth"
import { saveScore } from "@/lib/features/games"

type Difficulty = "easy" | "medium" | "hard" | "expert"
type TimeLength = 30 | 60 | 120

interface GameStats {
  wpm: number
  accuracy: number
  correctWords: number
  totalWords: number
  errors: number
}

// Word lists by difficulty
const WORD_LISTS = {
  easy: [
    "cat", "dog", "run", "sun", "fun", "hot", "cold", "big", "small", "fast",
    "slow", "good", "bad", "new", "old", "red", "blue", "green", "black", "white",
    "jump", "walk", "talk", "play", "work", "eat", "drink", "sleep", "read", "write",
    "love", "hate", "like", "want", "need", "have", "make", "take", "give", "come",
    "go", "see", "look", "find", "tell", "ask", "use", "call", "help", "know"
  ],
  medium: [
    "about", "after", "again", "always", "around", "because", "before", "being",
    "better", "between", "change", "different", "during", "enough", "every",
    "follow", "great", "group", "important", "interest", "large", "learn", "leave",
    "letter", "little", "money", "month", "never", "night", "nothing", "number",
    "often", "order", "other", "people", "person", "place", "point", "power",
    "present", "public", "question", "really", "right", "school", "should", "simple",
    "small", "social", "something", "sometimes", "still", "student", "system"
  ],
  hard: [
    "ability", "absolutely", "accomplish", "according", "achieve", "actually",
    "additional", "address", "administration", "advantage", "affect", "afternoon",
    "although", "amazing", "American", "analysis", "another", "apparent", "application",
    "approach", "appropriate", "argument", "article", "association", "attention",
    "attractive", "authority", "available", "beautiful", "beginning", "behavior",
    "believe", "benefit", "business", "campaign", "capacity", "capital", "carefully",
    "category", "central", "century", "certainly", "challenge", "character", "choose",
    "collection", "commercial", "commission", "committee", "community", "company"
  ],
  expert: [
    "accommodate", "acknowledge", "acquaintance", "acquisition", "administrative",
    "advantageous", "advertisement", "archaeological", "architecture", "arrangement",
    "assessment", "association", "assumption", "atmosphere", "authentication",
    "authorization", "automatically", "availability", "breakthrough", "bureaucracy",
    "capabilities", "catastrophe", "categorization", "celebration", "characteristic",
    "circumstances", "classification", "collaboration", "collectively", "combination",
    "commemorate", "commission", "commitment", "communicate", "comparison",
    "competence", "competition", "complement", "comprehension", "comprehensive",
    "concentration", "conceptualize", "Configuration", "confirmation", "congregation",
    "consciousness", "consequences", "conservation", "consideration", "consolidation",
    "construction", "consultation", "contemporary", "continuation", "contribution"
  ]
}

export default function TypingGamePage() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [timeLength, setTimeLength] = useState<TimeLength>(60)
  const [timeLeft, setTimeLeft] = useState<number>(timeLength)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [input, setInput] = useState("")
  const [words, setWords] = useState<string[]>([])
  const [correctWords, setCorrectWords] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [errors, setErrors] = useState(0)
  const [stats, setStats] = useState<GameStats | null>(null)
  const [user, setUser] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  // Generate random words based on difficulty
  const generateWords = useCallback((diff: Difficulty, count: number = 100) => {
    const wordList = WORD_LISTS[diff]
    const generatedWords: string[] = []
    for (let i = 0; i < count; i++) {
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)]
      generatedWords.push(randomWord)
    }
    return generatedWords
  }, [])

  // Start game
  const startGame = () => {
    const newWords = generateWords(difficulty)
    setWords(newWords)
    setCurrentWordIndex(0)
    setInput("")
    setCorrectWords(0)
    setTotalAttempts(0)
    setErrors(0)
    setTimeLeft(timeLength)
    setStats(null)
    setGameState("playing")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing") return

    if (timeLeft <= 0) {
      endGame()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, timeLeft])

  // End game and calculate stats
  const endGame = () => {
    const timeElapsed = timeLength - timeLeft
    const minutes = timeElapsed / 60
    const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0
    const accuracy = totalAttempts > 0 ? Math.round((correctWords / totalAttempts) * 100) : 0

    setStats({
      wpm,
      accuracy,
      correctWords,
      totalWords: totalAttempts,
      errors
    })
    setGameState("finished")

    // Save score to DB
    if (user && wpm > 0) {
      saveScore(user.id, "typing", wpm).catch(err => console.error("Score save failed:", err))
    }
  }

  // Handle word input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Check if user pressed space (completed word)
    if (value.endsWith(" ")) {
      const typedWord = value.trim()
      const currentWord = words[currentWordIndex]

      setTotalAttempts((prev) => prev + 1)

      if (typedWord === currentWord) {
        setCorrectWords((prev) => prev + 1)
        setCurrentWordIndex((prev) => prev + 1)
      } else {
        setErrors((prev) => prev + 1)
        setCurrentWordIndex((prev) => prev + 1)
      }

      setInput("")
    } else {
      setInput(value)
    }
  }

  // Keyboard shortcut to restart
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && gameState === "playing") {
        endGame()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Get difficulty color
  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case "easy": return "text-green-500 border-green-500"
      case "medium": return "text-yellow-500 border-yellow-500"
      case "hard": return "text-orange-500 border-orange-500"
      case "expert": return "text-red-500 border-red-500"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">⌨️ Typing Speed Test</h1>
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground">Test your typing speed and accuracy</p>
              <span className="text-muted-foreground/30">|</span>
              <Link href="/dashboard/entertainment/leaderboard" className="text-primary hover:underline flex items-center gap-1">
                <Trophy className="h-3 w-3" /> Hall of Fame
              </Link>
            </div>
          </div>
          <Link href="/dashboard/entertainment">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Idle State - Game Setup */}
        {gameState === "idle" && (
          <Card className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <Keyboard className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Ready to Type?</h2>
              <p className="text-muted-foreground">Choose your difficulty and time limit</p>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Difficulty Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["easy", "medium", "hard", "expert"] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      difficulty === diff
                        ? `${getDifficultyColor(diff)} bg-primary/5`
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-bold capitalize">{diff}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {diff === "easy" && "3-4 letters"}
                      {diff === "medium" && "5-7 letters"}
                      {diff === "hard" && "8-10 letters"}
                      {diff === "expert" && "11+ letters"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Length Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Time Limit</label>
              <div className="grid grid-cols-3 gap-3">
                {([30, 60, 120] as TimeLength[]).map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimeLength(time)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      timeLength === time
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Clock className="h-5 w-5 mx-auto mb-2" />
                    <div className="font-bold">{time}s</div>
                    <div className="text-xs text-muted-foreground">
                      {time === 30 && "Quick"}
                      {time === 60 && "Standard"}
                      {time === 120 && "Marathon"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={startGame} className="w-full h-12 text-lg gap-2">
              <Zap className="h-5 w-5" />
              Start Typing Test
            </Button>
          </Card>
        )}

        {/* Playing State */}
        {gameState === "playing" && (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Time Left</span>
                </div>
                <div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-500" : ""}`}>
                  {formatTime(timeLeft)}
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Correct</span>
                </div>
                <div className="text-2xl font-bold text-green-500">{correctWords}</div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">WPM</span>
                </div>
                <div className="text-2xl font-bold">
                  {timeLength - timeLeft > 0
                    ? Math.round(correctWords / ((timeLength - timeLeft) / 60))
                    : 0}
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm">Accuracy</span>
                </div>
                <div className="text-2xl font-bold">
                  {totalAttempts > 0 ? Math.round((correctWords / totalAttempts) * 100) : 100}%
                </div>
              </Card>
            </div>

            {/* Word Display */}
            <Card className="p-8 min-h-[400px]">
              <div className="space-y-6">
                {/* Current Word - Large Display */}
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Type this word:</div>
                  <div className="text-5xl sm:text-6xl font-bold mb-8 tracking-wide">
                    {words[currentWordIndex]}
                  </div>
                </div>

                {/* Input Field */}
                <div className="max-w-md mx-auto">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    className="text-2xl text-center h-16 font-mono"
                    placeholder="Start typing..."
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> to submit word
                  </p>
                </div>

                {/* Next Words Preview */}
                <div className="text-center mt-8">
                  <div className="text-xs text-muted-foreground mb-2">Coming up:</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {words.slice(currentWordIndex + 1, currentWordIndex + 6).map((word, idx) => (
                      <span key={idx} className="text-muted-foreground text-sm">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={endGame} className="gap-2">
                End Test
              </Button>
              <Button variant="outline" onClick={startGame} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Restart
              </Button>
            </div>
          </div>
        )}

        {/* Finished State - Results */}
        {gameState === "finished" && stats && (
          <Card className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Test Complete!</h2>
              <p className="text-muted-foreground">Here are your results</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-6 border-2 border-primary rounded-lg bg-primary/5">
                <div className="text-5xl font-bold text-primary mb-2">{stats.wpm}</div>
                <div className="text-sm text-muted-foreground">Words Per Minute</div>
              </div>
              <div className="text-center p-6 border-2 border-green-500 rounded-lg bg-green-500/5">
                <div className="text-5xl font-bold text-green-500 mb-2">{stats.accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{stats.correctWords}</div>
                <div className="text-xs text-muted-foreground mt-1">Correct Words</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold">{stats.totalWords}</div>
                <div className="text-xs text-muted-foreground mt-1">Total Attempts</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
                <div className="text-xs text-muted-foreground mt-1">Errors</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold capitalize">{difficulty}</div>
                <div className="text-xs text-muted-foreground mt-1">Difficulty</div>
              </Card>
            </div>

            {/* Performance Message */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="font-medium">
                {stats.wpm >= 60 && "🔥 Excellent! You're a typing master!"}
                {stats.wpm >= 40 && stats.wpm < 60 && "👍 Great job! Above average typing speed!"}
                {stats.wpm >= 25 && stats.wpm < 40 && "👌 Good work! Keep practicing to improve!"}
                {stats.wpm < 25 && "💪 Nice try! Practice makes perfect!"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={startGame} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => setGameState("idle")} className="gap-2">
                Change Settings
              </Button>
              <Link href="/dashboard/entertainment">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  Back to Games
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 bg-muted/30">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            How to Play
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Type the displayed word exactly as shown</li>
            <li>• Press <kbd className="px-2 py-1 bg-background rounded text-xs">Space</kbd> to submit each word</li>
            <li>• Type as many words correctly as possible before time runs out</li>
            <li>• Higher difficulty = longer words, higher WPM potential</li>
            <li>• Press <kbd className="px-2 py-1 bg-background rounded text-xs">Esc</kbd> to end the test early</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
