/**
 * Enhanced Cyberpunk Color Palette
 * Utility classes and helpers for using accent colors
 */

export const accentColors = {
  cyan: 'var(--accent-cyan)',
  purple: 'var(--accent-purple)',
  pink: 'var(--accent-pink)',
  green: 'var(--primary)',
  yellow: 'var(--warning)',
  red: 'var(--destructive)',
} as const;

export const statusColors = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--destructive)',
  info: 'var(--info)',
} as const;

/**
 * Tailwind utility classes for accent colors
 * Use these in className props
 */
export const accentClasses = {
  cyan: {
    bg: 'bg-[var(--accent-cyan)]',
    text: 'text-[var(--accent-cyan)]',
    border: 'border-[var(--accent-cyan)]',
    glow: 'shadow-[0_0_20px_var(--accent-cyan)]',
  },
  purple: {
    bg: 'bg-[var(--accent-purple)]',
    text: 'text-[var(--accent-purple)]',
    border: 'border-[var(--accent-purple)]',
    glow: 'shadow-[0_0_20px_var(--accent-purple)]',
  },
  pink: {
    bg: 'bg-[var(--accent-pink)]',
    text: 'text-[var(--accent-pink)]',
    border: 'border-[var(--accent-pink)]',
    glow: 'shadow-[0_0_20px_var(--accent-pink)]',
  },
  green: {
    bg: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary',
    glow: 'shadow-[0_0_20px_var(--primary)]',
  },
  yellow: {
    bg: 'bg-[var(--warning)]',
    text: 'text-[var(--warning)]',
    border: 'border-[var(--warning)]',
    glow: 'shadow-[0_0_20px_var(--warning)]',
  },
  red: {
    bg: 'bg-destructive',
    text: 'text-destructive',
    border: 'border-destructive',
    glow: 'shadow-[0_0_20px_var(--destructive)]',
  },
} as const;

/**
 * Status badge variants
 */
export const statusBadgeClasses = {
  success: 'bg-[var(--success)] text-[var(--success-foreground)]',
  warning: 'bg-[var(--warning)] text-[var(--warning-foreground)]',
  error: 'bg-destructive text-destructive-foreground',
  info: 'bg-[var(--info)] text-[var(--info-foreground)]',
} as const;

/**
 * Get a random accent color for variety
 */
export function getRandomAccentColor(): keyof typeof accentColors {
  const colors = Object.keys(accentColors) as Array<keyof typeof accentColors>;
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Gradient backgrounds using accent colors
 */
export const gradientClasses = {
  cyanPurple: 'bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)]',
  greenCyan: 'bg-gradient-to-br from-[var(--primary)] to-[var(--accent-cyan)]',
  pinkPurple: 'bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-purple)]',
  rainbow: 'bg-gradient-to-r from-[var(--primary)] via-[var(--accent-cyan)] via-[var(--accent-purple)] to-[var(--accent-pink)]',
} as const;
