/**
 * components/GameTable.jsx — Sortable Games Leaderboard
 *
 * Demonstrates key React concepts:
 *   - useState: local state for which column to sort by
 *   - Derived data: we sort `games` to produce `sorted` — no extra state needed
 *   - Conditional rendering: different badge colors, status pills
 *   - Array.map(): turning data arrays into JSX elements
 */
import React, { useState, useMemo } from 'react'
import { formatCoins, formatNumber, jackpotPct, jackpotColor } from '../utils/format'
import styles from './GameTable.module.css'

const SORT_OPTIONS = [
  { key: 'plays',   label: 'Popularité' },
  { key: 'profit',  label: 'Profit' },
  { key: 'jackpot', label: 'Jackpot' },
]

const STATUS_CONFIG = {
  open:   { label: 'Ouvert', className: 'open' },
  hot:    { label: 'Hot 🔥', className: 'hot' },
  closed: { label: 'Fermé',  className: 'closed' },
}

export default function GameTable({ games = [] }) {
  // useState returns [currentValue, setterFunction]
  // When the setter is called, React re-renders this component
  const [sortKey, setSortKey] = useState('plays')

  // useMemo only re-sorts when `games` or `sortKey` changes
  // Without it, sorting runs on every render (wasteful)
  const sorted = useMemo(() => {
    return [...games].sort((a, b) => b[sortKey] - a[sortKey])
  }, [games, sortKey])

  const maxVal = useMemo(() => {
    const vals = games.map(g => g[sortKey] ?? 0)
    return Math.max(...vals, 1)
  }, [games, sortKey])

  return (
    <div className={styles.wrapper}>
      {/* Sort buttons */}
      <div className={styles.header}>
        <span className={styles.title}>Classement des jeux</span>
        <div className={styles.sortBtns}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`${styles.sortBtn} ${sortKey === opt.key ? styles.sortBtnActive : ''}`}
              onClick={() => setSortKey(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Jeu</th>
              <th className={styles.r}>Participations</th>
              <th className={styles.r}>Profit net</th>
              <th className={styles.r}>Jackpot restant</th>
              <th className={styles.r}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((game, i) => {
              const pct = jackpotPct(game.jackpot, game.jackpotMax)
              const barColor = jackpotColor(pct)
              const status = STATUS_CONFIG[game.status] ?? STATUS_CONFIG.open

              return (
                <tr key={game.id} className={styles.row}>
                  {/* Rank badge: gold/silver/bronze for top 3 */}
                  <td>
                    <span className={`${styles.rank} ${styles[`rank${i + 1}`] || styles.rankN}`}>
                      {i + 1}
                    </span>
                  </td>

                  <td>
                    <span className={styles.gameEmoji}>{game.emoji}</span>
                    <span className={styles.gameName}>{game.name}</span>
                    <span className={styles.tag}>{game.type}</span>
                  </td>

                  <td className={`${styles.r} ${styles.mono}`}>
                    {formatNumber(game.plays)}
                  </td>

                  <td className={styles.r}>
                    <span className={styles.mono} style={{ color: game.profit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {game.profit >= 0 ? '+' : ''}{formatCoins(game.profit)}
                    </span>
                  </td>

                  {/* Jackpot bar */}
                  <td className={styles.r}>
                    <div className={styles.jackpotCell}>
                      <span className={styles.mono}>{formatCoins(game.jackpot)}</span>
                      <div className={styles.barBg}>
                        <div
                          className={styles.barFill}
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className={styles.r}>
                    <span className={`${styles.pill} ${styles[`pill-${status.className}`]}`}>
                      <span className={styles.pillDot} />
                      {status.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
