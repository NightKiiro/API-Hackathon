import React from 'react'
import { formatCoins, timeAgo } from '../utils/format'
import styles from './TransactionFeed.module.css'

export default function TransactionFeed({
  transactions = [],
  title = '⚡ Transactions récentes',
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>{title}</div>

      <div className={styles.list}>
        {transactions.length === 0 && (
          <div className={styles.empty}>Aucune transaction pour l’instant…</div>
        )}

        {transactions.map((tx) => {
          const isIncome = tx.type === 'income'
          const amountColor = isIncome ? 'var(--green)' : 'var(--red)'

          return (
            <div key={tx.id} className={styles.row}>
              <div
                className={styles.icon}
                style={{
                  background: isIncome
                    ? 'rgba(0,229,160,0.12)'
                    : 'rgba(255,79,79,0.12)',
                }}
              >
                {isIncome ? '⬇️' : '⬆️'}
              </div>

              <div className={styles.info}>
                <div className={styles.txTitle}>
                  {isIncome ? 'Entrée de pièces' : 'Sortie de pièces'}
                </div>

                <div className={styles.meta}>
                  {tx.type} · jackpot {formatCoins(tx.jackpot_before)} → {formatCoins(tx.jackpot_after)}
                </div>

                <div className={styles.meta}>
                  {timeAgo(tx.created_at || tx.timestamp)}
                </div>
              </div>

              <div className={styles.amount} style={{ color: amountColor }}>
                {isIncome ? '+' : '-'}{formatCoins(tx.amount)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}