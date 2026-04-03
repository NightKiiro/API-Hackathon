import React, { useState, useMemo } from 'react'
import { formatCoins, formatNumber } from '../utils/format'
import styles from './GameTable.module.css'

const SORT_OPTIONS = [
  { key: 'total_transactions', label: 'Transactions' },
  { key: 'net_revenue', label: 'Revenu net' },
  { key: 'current_jackpot', label: 'Jackpot' },
  { key: 'total_income', label: 'Encaissement' },
]

const STATUS_CONFIG = {
  active: { label: 'Ouvert', className: 'open' },
  closed: { label: 'Fermé', className: 'closed' },
}

export default function GameTable({ games = [], selectedGameId, onSelectGame }) {
  const [sortKey, setSortKey] = useState('total_transactions')

  const sorted = useMemo(() => {
    return [...games].sort((a, b) => {
      const aVal = a?.[sortKey] ?? 0
      const bVal = b?.[sortKey] ?? 0
      return bVal - aVal
    })
  }, [games, sortKey])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>Classement des jeux</span>

        <div className={styles.sortBtns}>
          {SORT_OPTIONS.map((opt) => (
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
              <th className={styles.r}>Transactions</th>
              <th className={styles.r}>Income</th>
              <th className={styles.r}>Payout</th>
              <th className={styles.r}>Net</th>
              <th className={styles.r}>Jackpot</th>
              <th className={styles.r}>Statut</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((game, i) => {
              const status = STATUS_CONFIG[game.status] ?? STATUS_CONFIG.active

              return (
                <tr
                  key={game.id}
                  className={`${styles.row} ${game.id === selectedGameId ? styles.selectedRow : ''}`}
                  onClick={() => onSelectGame?.(game.id)}
                >
                  <td>
                    <span className={`${styles.rank} ${styles[`rank${i + 1}`] || styles.rankN}`}>
                      {i + 1}
                    </span>
                  </td>

                  <td>
                    <div className={styles.gameName}>{game.name}</div>
                    {game.description && (
                      <div className={styles.tag}>{game.description}</div>
                    )}
                  </td>

                  <td className={`${styles.r} ${styles.mono}`}>
                    {formatNumber(game.total_transactions)}
                  </td>

                  <td className={`${styles.r} ${styles.mono}`} style={{ color: 'var(--green)' }}>
                    {formatCoins(game.total_income)}
                  </td>

                  <td className={`${styles.r} ${styles.mono}`} style={{ color: 'var(--red)' }}>
                    {formatCoins(game.total_payout)}
                  </td>

                  <td
                    className={`${styles.r} ${styles.mono}`}
                    style={{ color: game.net_revenue >= 0 ? 'var(--green)' : 'var(--red)' }}
                  >
                    {game.net_revenue >= 0 ? '+' : ''}{formatCoins(game.net_revenue)}
                  </td>

                  <td className={`${styles.r} ${styles.mono}`}>
                    {formatCoins(game.current_jackpot)}
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