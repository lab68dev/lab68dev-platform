"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Trophy } from "lucide-react"
import { getCurrentUser } from "@/lib/features/auth"
import { saveScore } from "@/lib/features/games"

type GameMode = "scramble" | "typing"

const WORD_LISTS = {
  easy: [
    "cat", "dog", "sun", "moon", "star", "tree", "bird", "fish", "door", "book",
    "hand", "foot", "eyes", "ears", "nose", "cake", "milk", "eggs", "rice", "soup"
  ],
  medium: [
    "computer", "keyboard", "monitor", "speaker", "printer", "scanner", "network",
    "software", "hardware", "database", "internet", "website", "browser", "server",
    "program", "function", "variable", "constant", "algorithm", "framework"
  ],
  hard: [
    "extraordinary", "communicate", "professional", "intelligence", "architecture",
    "synchronization", "infrastructure", "responsibility", "authentication", "configuration",
    "implementation", "optimization", "documentation", "collaboration", "contribution"
  ]
}

const TYPING_SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump!",
  "The five boxing wizards jump quickly.",
  "Sphinx of black quartz, judge my vow.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Experience is the name everyone gives to their mistakes."
]

export default function WordScramblePage() {
  const [gameMode, setGameMode] = useState<GameMode>("scramble")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [currentWord, setCurrentWord] = useState("")
  const [scrambledWord, setScrambledWord] = useState("")
  const [typingSentence, setTypingSentence] = useState("")
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [correctWords, setCorrectWords] = useState(0)
  const [wrongWords, setWrongWords] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [totalChars, setTotalChars] = useState(0)
  const [user, setUser] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUser(getCurrentUser())
    
    const savedHighScore = localStorage.getItem(`${gameMode}HighScore`)
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
  }, [gameMode])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem(`${gameMode}HighScore`, score.toString())
    }
  }, [score, highScore, gameMode])

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
      saveScore(user.id, gameMode === "scramble" ? "scramble" : "typing", score)
        .catch(err => console.error("Score save failed:", err))
    }
  }, [gameOver, score, user, gameMode])

  function scrambleWord(word: string): string {
    const arr = word.split("")
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    const scrambled = arr.join("")
    return scrambled === word ? scrambleWord(word) : scrambled
  }

  function getRandomWord(): string {
    const words = WORD_LISTS[difficulty]
    return words[Math.floor(Math.random() * words.length)]
  }

  function getRandomSentence(): string {
    return TYPING_SENTENCES[Math.floor(Math.random() * TYPING_SENTENCES.length)]
  }

  function startGame() {
    setScore(0)
    setCorrectWords(0)
    setWrongWords(0)
    setTimeLeft(60)
    setIsPlaying(true)
    setGameOver(false)
    setStreak(0)
    setUserInput("")
    setWpm(0)
    setTotalChars(0)
    setStartTime(Date.now())

    if (gameMode === "scramble") {
      const word = getRandomWord()
      setCurrentWord(word)
      setScrambledWord(scrambleWord(word))
    } else {
      setTypingSentence(getRandomSentence())
    }

    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function calculateWPM(): number {
    if (!startTime) return 0
    const timeElapsed = (Date.now() - startTime) / 1000 / 60 // minutes
    const words = totalChars / 5 // standard: 5 chars = 1 word
    return Math.round(words / timeElapsed)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isPlaying || userInput.trim() === "") return

    if (gameMode === "scramble") {
      const isCorrect = userInput.toLowerCase() === currentWord.toLowerCase()

      if (isCorrect) {
        const points = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30
        const bonusPoints = Math.min(streak * 5, 50)
        setScore(prev => prev + points + bonusPoints)
        setCorrectWords(prev => prev + 1)
        setStreak(prev => {
          const newStreak = prev + 1
          if (newStreak > bestStreak) setBestStreak(newStreak)
          return newStreak
        })
        setTotalChars(prev => prev + currentWord.length)

        // Next word
        const word = getRandomWord()
        setCurrentWord(word)
        setScrambledWord(scrambleWord(word))
      } else {
        setWrongWords(prev => prev + 1)
        setStreak(0)
      }

      setUserInput("")
      inputRef.current?.focus()
    } else {
      // Typing mode
      const isCorrect = userInput === typingSentence

      if (isCorrect) {
        const points = 50
        const currentWPM = calculateWPM()
        const wpmBonus = Math.floor(currentWPM / 10) * 10
        setScore(prev => prev + points + wpmBonus)
        setCorrectWords(prev => prev + 1)
        setTotalChars(prev => prev + typingSentence.length)
        setWpm(currentWPM)

        // Next sentence
        setTypingSentence(getRandomSentence())
      } else {
        setWrongWords(prev => prev + 1)
      }

      setUserInput("")
      inputRef.current?.focus()
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function getTypingAccuracy(): number {
    if (typingSentence.length === 0) return 100
    let correct = 0
    const minLength = Math.min(userInput.length, typingSentence.length)
    for (let i = 0; i < minLength; i++) {
      if (userInput[i] === typingSentence[i]) correct++
    }
    return Math.round((correct / typingSentence.length) * 100)
  }

  function switchMode(mode: GameMode) {
    setGameMode(mode)
    setIsPlaying(false)
    setGameOver(false)
    setUserInput("")
    const savedHighScore = localStorage.getItem(`${mode}HighScore`)
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    } else {
      setHighScore(0)
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
        <h1 className="text-4xl font-bold mb-2">Word Challenge</h1>
        <p className="text-muted-foreground">Test your word skills with scramble or typing challenges!</p>
      </div>

      {/* Game Mode Selection */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => switchMode("scramble")}
          disabled={isPlaying}
          className={`px-6 py-3 rounded font-medium transition-colors ${
            gameMode === "scramble" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          } disabled:opacity-50`}
        >
          Word Scramble
        </button>
        <button
          onClick={() => switchMode("typing")}
          disabled={isPlaying}
          className={`px-6 py-3 rounded font-medium transition-colors ${
            gameMode === "typing" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          } disabled:opacity-50`}
        >
          Typing Challenge
        </button>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {gameMode === "scramble" && (
          <div className="flex gap-2">
            <button
              onClick={() => setDifficulty("easy")}
              disabled={isPlaying}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                difficulty === "easy" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              } disabled:opacity-50`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty("medium")}
              disabled={isPlaying}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                difficulty === "medium" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              } disabled:opacity-50`}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficulty("hard")}
              disabled={isPlaying}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                difficulty === "hard" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              } disabled:opacity-50`}
            >
              Hard
            </button>
          </div>
        )}
        
        <button
          onClick={startGame}
          className="px-6 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90"
        >
          {isPlaying ? "Restart" : "Start Game"}
        </button>

        <div className="ml-auto text-2xl font-mono font-bold">
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Game Area */}
      {!gameOver && isPlaying ? (
        <div className="mb-6 border-4 border-border rounded-lg p-8 bg-card">
          <div className="max-w-2xl mx-auto">
            {gameMode === "scramble" ? (
              <>
                {/* Scrambled Word */}
                <div className="text-center mb-8">
                  <p className="text-sm text-muted-foreground mb-2">Unscramble this word:</p>
                  <div className="text-5xl font-bold mb-4 tracking-wider text-primary">
                    {scrambledWord.toUpperCase()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ({scrambledWord.length} letters)
                  </p>
                  
                  {streak > 0 && (
                    <div className="mt-4 text-lg font-semibold text-primary animate-pulse">
                      🔥 {streak} Streak! +{Math.min(streak * 5, 50)} Bonus
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Typing Sentence */}
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-4">Type this sentence:</p>
                  <div className="text-xl font-mono mb-4 p-4 bg-muted rounded-lg">
                    {typingSentence.split("").map((char, idx) => (
                      <span
                        key={idx}
                        className={
                          idx < userInput.length
                            ? userInput[idx] === char
                              ? "text-green-500"
                              : "text-red-500 bg-red-500/20"
                            : "text-foreground"
                        }
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Accuracy: <span className="font-bold text-primary">{getTypingAccuracy()}%</span>
                    {wpm > 0 && <span className="ml-4">WPM: <span className="font-bold text-primary">{wpm}</span></span>}
                  </div>
                </div>
              </>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={!isPlaying}
                placeholder={gameMode === "scramble" ? "Type the unscrambled word..." : "Type the sentence exactly..."}
                className="w-full px-6 py-4 text-center text-2xl font-mono border-2 border-border bg-background rounded-lg focus:outline-none focus:ring-4 focus:ring-primary disabled:opacity-50"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                disabled={!isPlaying || userInput.trim() === ""}
                className="w-full px-6 py-4 bg-primary text-primary-foreground text-xl font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : !isPlaying && !gameOver ? (
        <div className="border-4 border-border rounded-lg p-12 bg-card text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">{gameMode === "scramble" ? "🔤" : "⌨️"}</div>
            <h2 className="text-2xl font-bold mb-4">Ready to Challenge?</h2>
            <p className="text-muted-foreground mb-6">
              {gameMode === "scramble" 
                ? "Select a difficulty and click 'Start Game' to unscramble words!"
                : "Click 'Start Game' to test your typing speed and accuracy!"}
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
                <div className="text-3xl font-bold text-primary">{correctWords + wrongWords}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="border border-border bg-card p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-500">{correctWords}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="border border-border bg-card p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-500">{wrongWords}</div>
                <div className="text-sm text-muted-foreground">Wrong</div>
              </div>
            </div>
            {gameMode === "scramble" && bestStreak > 0 && (
              <div className="text-lg mb-4">
                Best Streak: <span className="font-bold text-primary">🔥 {bestStreak}</span>
              </div>
            )}
            {gameMode === "typing" && wpm > 0 && (
              <div className="text-lg mb-4">
                Final WPM: <span className="font-bold text-primary">⌨️ {wpm}</span>
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
          <div className="text-2xl font-bold text-primary">{correctWords}</div>
          <div className="text-xs text-muted-foreground">Correct</div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">
            {gameMode === "scramble" ? streak : wpm}
          </div>
          <div className="text-xs text-muted-foreground">
            {gameMode === "scramble" ? "Streak" : "WPM"}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 border border-border bg-card rounded-lg">
        <h3 className="font-bold mb-3">How to Play</h3>
        {gameMode === "scramble" ? (
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Unscramble as many words as possible in 60 seconds</li>
            <li>• Easy: 10 points | Medium: 20 points | Hard: 30 points per word</li>
            <li>• Build a streak for bonus points (max +50 per word)</li>
            <li>• Wrong answers break your streak</li>
            <li>• Type the word and press Enter or click Submit</li>
          </ul>
        ) : (
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Type sentences exactly as shown in 60 seconds</li>
            <li>• Earn 50 points per correct sentence</li>
            <li>• Bonus points based on typing speed (WPM)</li>
            <li>• Green letters are correct, red letters are wrong</li>
            <li>• Improve your typing speed and accuracy!</li>
          </ul>
        )}
      </div>
    </div>
  )
}
