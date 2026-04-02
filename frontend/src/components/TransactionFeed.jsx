/**
 * components/TransactionFeed.jsx — Live Transaction Feed
 *
 * Shows the most recent bets across all games.
 * The `timeAgo` helper recalculates on each render, so timestamps
 * stay fresh without needing a separate timer.
 */
import React from 'react'
import { formatCoins, timeAgo } from '../utils/format'
import styles from './TransactionFeed.module.css'

export default function TransactionFeed({ transactions = [], title = '⚡ Transactions récentes' }) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>{title}</div>
      <div className={styles.list}>
        {transactions.length === 0 && (
          <div className={styles.empty}>Aucune transaction pour l'instant…</div>
        )}
        {transactions.map((tx) => {
          const isWin = tx.result === 'win'
          return (
            <div key={tx.id} className={styles.row}>
              <div
                className={styles.icon}
                style={{ background: isWin ? 'rgba(0,229,160,0.1)' : 'rgba(255,79,79,0.08)' }}
              >
                {tx.emoji}
              </div>
              <div className={styles.info}>
                <div className={styles.txTitle}>
                  <span className={styles.player}>{tx.player}</span>
                  <span className={styles.game}> · {tx.game}</span>
                </div>
                <div className={styles.meta}>
                  Mise {formatCoins(tx.bet)} · {timeAgo(tx.timestamp)}
                </div>
              </div>
              <div
                className={styles.amount}
                style={{ color: isWin ? 'var(--green)' : 'var(--red)' }}
              >
                {isWin ? '+' : ''}{formatCoins(tx.gain)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
