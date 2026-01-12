export type Theme = "light" | "dark"

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  const theme = localStorage.getItem("lab68_theme")
  return (theme as Theme) || "dark"
}

export function setTheme(theme: Theme): void {
  localStorage.setItem("lab68_theme", theme)
  if (theme === "light") {
    document.documentElement.classList.add("light")
  } else {
    document.documentElement.classList.remove("light")
  }
}

export function initTheme(): void {
  const theme = getTheme()
  setTheme(theme)
}
