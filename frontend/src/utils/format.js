/**
 * utils/format.js — Formatting Helpers
 *
 * Pure functions (no React, no side effects) that format raw numbers
 * into readable strings. Centralizing them here means if the format
 * changes, you fix it in one place.
 */

/** Format coins: 1500 → "1.5k 🪙", 50 → "50 🪙" */
export function formatCoins(n) {
  if (n == null) return '—'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k 🪙`
  return `${n} 🪙`
}

/** Format a plain number: 142300 → "142.3k" */
export function formatNumber(n) {
  if (n == null) return '—'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return `${n}`
}

/** Jackpot health percentage */
export function jackpotPct(jackpot, jackpotMax) {
  if (!jackpotMax) return 0
  return Math.round((jackpot / jackpotMax) * 100)
}

/** Jackpot bar color class based on health */
export function jackpotColor(pct) {
  if (pct > 50) return 'var(--green)'
  if (pct > 20) return 'var(--gold)'
  return 'var(--red)'
}

/** Relative time: "just now", "12s ago", "2m ago" */
export function timeAgo(date) {
  if (!date) return ''
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}
