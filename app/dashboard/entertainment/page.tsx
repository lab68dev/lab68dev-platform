"use client"

import { useState } from "react"
import Link from "next/link"

type GameCategory = "casual" | "retro"
type Game = {
  id: string
  name: string
  description: string
  category: GameCategory
  icon: string
  href: string
}

const games: Game[] = [
  {
    id: "sudoku",
    name: "Sudoku",
    description: "Classic number puzzle game",
    category: "casual",
    icon: "sudoku",
    href: "/dashboard/entertainment/sudoku"
  },
  {
    id: "sliding-puzzle",
    name: "Sliding Puzzle",
    description: "Arrange tiles in order",
    category: "casual",
    icon: "sliding-puzzle",
    href: "/dashboard/entertainment/sliding-puzzle"
  },
  {
    id: "math-sprint",
    name: "Math Sprint",
    description: "Fast-paced math challenges",
    category: "casual",
    icon: "math-sprint",
    href: "/dashboard/entertainment/math-sprint"
  },
  {
    id: "word-scramble",
    name: "Word Scramble",
    description: "Unscramble words & typing test",
    category: "casual",
    icon: "word-scramble",
    href: "/dashboard/entertainment/word-scramble"
  },
  {
    id: "typing-game",
    name: "Typing Speed Test",
    description: "Test your typing speed & accuracy",
    category: "casual",
    icon: "typing-game",
    href: "/dashboard/entertainment/typing-game"
  },
  {
    id: "snake",
    name: "Snake",
    description: "Classic snake game",
    category: "retro",
    icon: "snake",
    href: "/dashboard/entertainment/snake"
  },
  {
    id: "tetris",
    name: "Tetris",
    description: "Falling blocks puzzle",
    category: "retro",
    icon: "tetris",
    href: "/dashboard/entertainment/tetris"
  }
]

function GameIcon({ type }: { type: string }) {
  switch (type) {
    case "sudoku":
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <rect x="10" y="10" width="80" height="80" fill="none" stroke="white" strokeWidth="3"/>
            <line x1="36.67" y1="10" x2="36.67" y2="90" stroke="white" strokeWidth="1"/>
            <line x1="63.33" y1="10" x2="63.33" y2="90" stroke="white" strokeWidth="1"/>
            <line x1="10" y1="36.67" x2="90" y2="36.67" stroke="white" strokeWidth="1"/>
            <line x1="10" y1="63.33" x2="90" y2="63.33" stroke="white" strokeWidth="1"/>
            <line x1="36.67" y1="10" x2="36.67" y2="90" stroke="white" strokeWidth="3"/>
            <line x1="63.33" y1="10" x2="63.33" y2="90" stroke="white" strokeWidth="3"/>
            <line x1="10" y1="36.67" x2="90" y2="36.67" stroke="white" strokeWidth="3"/>
            <line x1="10" y1="63.33" x2="90" y2="63.33" stroke="white" strokeWidth="3"/>
            <text x="23" y="28" fill="white" fontSize="16" fontWeight="bold">5</text>
            <text x="50" y="28" fill="white" fontSize="16" fontWeight="bold">3</text>
            <text x="23" y="55" fill="white" fontSize="16" fontWeight="bold">7</text>
            <text x="77" y="55" fill="white" fontSize="16" fontWeight="bold">2</text>
            <text x="50" y="82" fill="white" fontSize="16" fontWeight="bold">9</text>
          </svg>
        </div>
      )
    case "sliding-puzzle":
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <rect x="10" y="10" width="25" height="25" fill="#00FF99" stroke="white" strokeWidth="2" rx="3"/>
            <text x="17" y="30" fill="black" fontSize="16" fontWeight="bold">1</text>
            <rect x="37.5" y="10" width="25" height="25" fill="#00FF99" stroke="white" strokeWidth="2" rx="3"/>
            <text x="44.5" y="30" fill="black" fontSize="16" fontWeight="bold">2</text>
            <rect x="65" y="10" width="25" height="25" fill="#00FF99" stroke="white" strokeWidth="2" rx="3"/>
            <text x="72" y="30" fill="black" fontSize="16" fontWeight="bold">3</text>
            <rect x="10" y="37.5" width="25" height="25" fill="#00FF99" stroke="white" strokeWidth="2" rx="3"/>
            <text x="17" y="57.5" fill="black" fontSize="16" fontWeight="bold">4</text>
            <rect x="37.5" y="37.5" width="25" height="25" fill="#00FF99" stroke="white" strokeWidth="2" rx="3"/>
            <text x="44.5" y="57.5" fill="black" fontSize="16" fontWeight="bold">5</text>
            <rect x="65" y="37.5" width="25" height="25" fill="#00FF99" stroke="white" strokeWidth="2" rx="3"/>
            <text x="72" y="57.5" fill="black" fontSize="16" fontWeight="bold">6</text>
            <rect x="10" y="65" width="25" height="25" fill="#00FF99" stroke="white" strokeWidth="2" rx="3"/>
            <text x="17" y="85" fill="black" fontSize="16" fontWeight="bold">7</text>
            <rect x="37.5" y="65" width="25" height="25" fill="#00FF99" stroke="white" strokeWidth="2" rx="3"/>
            <text x="44.5" y="85" fill="black" fontSize="16" fontWeight="bold">8</text>
            <rect x="65" y="65" width="25" height="25" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="2" strokeDasharray="4" rx="3"/>
          </svg>
        </div>
      )
    case "math-sprint":
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <circle cx="50" cy="50" r="35" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="3"/>
            <text x="25" y="40" fill="white" fontSize="24" fontWeight="bold">7</text>
            <text x="42" y="40" fill="white" fontSize="20" fontWeight="bold">+</text>
            <text x="60" y="40" fill="white" fontSize="24" fontWeight="bold">3</text>
            <line x1="20" y1="48" x2="80" y2="48" stroke="white" strokeWidth="2"/>
            <text x="38" y="70" fill="#00FF99" fontSize="28" fontWeight="bold">10</text>
            <path d="M 75 25 L 80 20 L 85 25" fill="none" stroke="#00FF99" strokeWidth="2"/>
            <circle cx="80" cy="28" r="8" fill="none" stroke="#00FF99" strokeWidth="2"/>
            <text x="76" y="32" fill="#00FF99" fontSize="10" fontWeight="bold">✓</text>
          </svg>
        </div>
      )
    case "word-scramble":
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-700 rounded-lg flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <rect x="15" y="25" width="70" height="50" rx="5" fill="rgba(0,0,0,0.3)" stroke="white" strokeWidth="2"/>
            <text x="28" y="45" fill="white" fontSize="14" fontWeight="bold">T</text>
            <text x="40" y="45" fill="white" fontSize="14" fontWeight="bold">A</text>
            <text x="52" y="45" fill="white" fontSize="14" fontWeight="bold">C</text>
            <text x="64" y="45" fill="white" fontSize="14" fontWeight="bold">E</text>
            <path d="M 35 50 Q 40 55 45 50" fill="none" stroke="#00FF99" strokeWidth="2"/>
            <path d="M 60 50 Q 65 45 70 50" fill="none" stroke="#00FF99" strokeWidth="2"/>
            <text x="22" y="68" fill="#00FF99" fontSize="12" fontWeight="bold">CAT</text>
            <rect x="15" y="80" width="4" height="8" fill="white"/>
            <rect x="25" y="80" width="4" height="8" fill="white"/>
            <rect x="35" y="80" width="4" height="8" fill="white"/>
            <rect x="45" y="80" width="4" height="8" fill="white"/>
          </svg>
        </div>
      )
    case "typing-game":
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <rect x="10" y="30" width="80" height="45" rx="3" fill="rgba(0,0,0,0.3)" stroke="white" strokeWidth="2"/>
            {/* Keys */}
            <rect x="15" y="40" width="8" height="8" rx="1" fill="white"/>
            <rect x="25" y="40" width="8" height="8" rx="1" fill="white"/>
            <rect x="35" y="40" width="8" height="8" rx="1" fill="white"/>
            <rect x="45" y="40" width="8" height="8" rx="1" fill="white"/>
            <rect x="55" y="40" width="8" height="8" rx="1" fill="white"/>
            <rect x="65" y="40" width="8" height="8" rx="1" fill="white"/>
            <rect x="75" y="40" width="8" height="8" rx="1" fill="white"/>
            <rect x="18" y="50" width="8" height="8" rx="1" fill="white"/>
            <rect x="28" y="50" width="8" height="8" rx="1" fill="white"/>
            <rect x="38" y="50" width="8" height="8" rx="1" fill="white"/>
            <rect x="48" y="50" width="8" height="8" rx="1" fill="#00FF99"/>
            <rect x="58" y="50" width="8" height="8" rx="1" fill="white"/>
            <rect x="68" y="50" width="8" height="8" rx="1" fill="white"/>
            <rect x="25" y="60" width="20" height="8" rx="1" fill="white"/>
            <rect x="55" y="60" width="20" height="8" rx="1" fill="white"/>
            {/* Speed lines */}
            <line x1="85" y1="35" x2="92" y2="35" stroke="#00FF99" strokeWidth="2"/>
            <line x1="85" y1="45" x2="95" y2="45" stroke="#00FF99" strokeWidth="2"/>
            <line x1="85" y1="55" x2="92" y2="55" stroke="#00FF99" strokeWidth="2"/>
          </svg>
        </div>
      )
    case "snake":
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <rect x="10" y="10" width="80" height="80" fill="rgba(0,0,0,0.3)" rx="4"/>
            <rect x="30" y="30" width="8" height="8" fill="#00FF99" rx="1"/>
            <rect x="38" y="30" width="8" height="8" fill="#00FF99" rx="1"/>
            <rect x="46" y="30" width="8" height="8" fill="#00FF99" rx="1"/>
            <rect x="46" y="38" width="8" height="8" fill="#00FF99" rx="1"/>
            <rect x="46" y="46" width="8" height="8" fill="#00FF99" rx="1"/>
            <rect x="54" y="46" width="8" height="8" fill="#00FF99" rx="1"/>
            <rect x="62" y="46" width="8" height="8" fill="#00FF99" rx="1"/>
            <circle cx="64" cy="48" r="1.5" fill="black"/>
            <circle cx="68" cy="48" r="1.5" fill="black"/>
            <circle cx="70" cy="60" r="3" fill="red"/>
          </svg>
        </div>
      )
    case "tetris":
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <rect x="10" y="10" width="80" height="80" fill="rgba(0,0,0,0.3)" rx="4"/>
            {/* I piece */}
            <rect x="15" y="20" width="6" height="6" fill="#00f0f0" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="21" y="20" width="6" height="6" fill="#00f0f0" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="27" y="20" width="6" height="6" fill="#00f0f0" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="33" y="20" width="6" height="6" fill="#00f0f0" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            {/* O piece */}
            <rect x="45" y="20" width="6" height="6" fill="#f0f000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="51" y="20" width="6" height="6" fill="#f0f000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="45" y="26" width="6" height="6" fill="#f0f000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="51" y="26" width="6" height="6" fill="#f0f000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            {/* T piece */}
            <rect x="27" y="35" width="6" height="6" fill="#a000f0" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="21" y="41" width="6" height="6" fill="#a000f0" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="27" y="41" width="6" height="6" fill="#a000f0" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="33" y="41" width="6" height="6" fill="#a000f0" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            {/* L piece */}
            <rect x="45" y="41" width="6" height="6" fill="#f0a000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="45" y="47" width="6" height="6" fill="#f0a000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="45" y="53" width="6" height="6" fill="#f0a000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="51" y="53" width="6" height="6" fill="#f0a000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            {/* S piece */}
            <rect x="63" y="26" width="6" height="6" fill="#00f000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="69" y="26" width="6" height="6" fill="#00f000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="57" y="32" width="6" height="6" fill="#00f000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="63" y="32" width="6" height="6" fill="#00f000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            {/* Z piece */}
            <rect x="63" y="44" width="6" height="6" fill="#f00000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="69" y="44" width="6" height="6" fill="#f00000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="69" y="50" width="6" height="6" fill="#f00000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <rect x="75" y="50" width="6" height="6" fill="#f00000" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          </svg>
        </div>
      )
    default:
      return null
  }
}

export default function EntertainmentPage() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | "all">("all")

  const filteredGames = selectedCategory === "all" 
    ? games 
    : games.filter(game => game.category === selectedCategory)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Games</h1>
        <p className="text-muted-foreground">Take a break with our collection of offline games</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          All Games
        </button>
        <button
          onClick={() => setSelectedCategory("casual")}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            selectedCategory === "casual"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Casual Puzzle
        </button>
        <button
          onClick={() => setSelectedCategory("retro")}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            selectedCategory === "retro"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Retro Arcade
        </button>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            className="group border border-border bg-card p-6 rounded-lg hover:border-primary transition-all hover:shadow-lg"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform flex justify-center">
              <GameIcon type={game.icon} />
            </div>
            <h3 className="text-xl font-bold mb-2">{game.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{game.description}</p>
            <div className="inline-block px-3 py-1 bg-muted text-xs font-medium rounded">
              {game.category === "casual" ? "Casual Puzzle" : "Retro Arcade"}
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-border bg-card p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-primary mb-2">{games.length}</h3>
          <p className="text-muted-foreground">Total Games</p>
        </div>
        <div className="border border-border bg-card p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-primary mb-2">
            {games.filter(g => g.category === "casual").length}
          </h3>
          <p className="text-muted-foreground">Casual Puzzles</p>
        </div>
        <div className="border border-border bg-card p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-primary mb-2">
            {games.filter(g => g.category === "retro").length}
          </h3>
          <p className="text-muted-foreground">Retro Arcade</p>
        </div>
      </div>
    </div>
  )
}
