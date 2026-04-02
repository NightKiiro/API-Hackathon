/**
 * components/MetricCard.jsx — Reusable Stat Card
 *
 * Props (inputs to a component) are like function arguments.
 * This card accepts:
 *   - label: string  → small label above the number
 *   - value: string  → big number / main value
 *   - sub: string    → small text below (trend, context)
 *   - color: string  → CSS variable name for the value color
 *   - accent: bool   → whether to show a colored top border
 */
import React from 'react'
import styles from './MetricCard.module.css'

export default function MetricCard({ label, value, sub, subUp, subDown, color = 'var(--gold)', accent }) {
  const subClass = subUp
    ? styles.subUp
    : subDown
    ? styles.subDown
    : styles.sub

  return (
    <div className={`${styles.card} ${accent ? styles.accent : ''}`}
         style={accent ? { '--accent-color': color } : {}}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value} style={{ color }}>{value ?? '—'}</div>
      {sub && <div className={subClass}>{sub}</div>}
    </div>
  )
}
