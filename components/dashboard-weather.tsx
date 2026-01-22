"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets } from "lucide-react"

type Weather = {
  temp: number
  condition: string
  humidity: number
  windSpeed: number
  location: string
}

export function DashboardWeather() {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        
        const mockWeather: Weather = {
          temp: Math.floor(Math.random() * 15) + 20, // 20-35°C
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Windy'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
          windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
          location: 'Your City'
        }
        
        setWeather(mockWeather)
      } catch (error) {
        console.error("Failed to fetch weather:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 1800000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return Sun
      case 'cloudy': return Cloud
      case 'rainy': return CloudRain
      case 'snowy': return CloudSnow
      case 'windy': return Wind
      default: return Cloud
    }
  }

  if (loading) {
    return (
      <div className="border border-border bg-card p-2 sm:p-3 min-w-[160px] flex items-center justify-center h-[100px] animate-pulse">
        <Cloud className="h-5 w-5 text-muted-foreground/50" />
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="border border-border bg-card p-2 sm:p-3 min-w-[160px] flex items-center justify-center h-[100px]">
        <div className="text-[10px] text-muted-foreground">Unavailable</div>
      </div>
    )
  }

  const WeatherIcon = getWeatherIcon(weather.condition)

  return (
    <div className="border border-border bg-card p-2 sm:p-3 min-w-[160px]">
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Local
            </div>
          </div>
          <WeatherIcon className="h-4 w-4 text-primary" />
        </div>

        {/* Temperature & Condition */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              {weather.temp}°
            </span>
            <span className="text-[10px] text-muted-foreground">C</span>
          </div>
          <div className="text-[10px] text-muted-foreground capitalize text-right">
            {weather.condition}
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between pt-1.5 border-t border-border">
          <div className="flex items-center gap-1">
            <Droplets className="h-3 w-3 text-cyan-500" />
            <span className="text-[9px] text-muted-foreground">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-3 w-3 text-cyan-500" />
            <span className="text-[9px] text-muted-foreground">{weather.windSpeed}k</span>
          </div>
        </div>
      </div>
    </div>
  )
}
