/**
 * components/PlayerList.jsx — Player Leaderboard
 *
 * Receives `players` as a prop and renders the ranking.
 * Note: this component has no state — it's a "pure" component.
 * It only renders what it receives. Simpler = easier to test.
 */
import React from 'react'
import styles from './PlayerList.module.css'

export default function PlayerList({ players = [] }) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>🏆 Classement joueurs</div>
      <div className={styles.list}>
        {players.map((p, i) => (
          <div key={p.id} className={styles.row}>
            <div className={styles.avatar} style={{ background: p.color + '22', color: p.color }}>
              {p.initials}
            </div>
            <div className={styles.info}>
              <div className={styles.name}>
                {i === 0 && '👑 '}{p.name}
              </div>
              <div className={styles.meta}>
                {p.plays} parties · {p.wins} gains
              </div>
            </div>
            <div className={styles.coins}>{p.coins}</div>
            <span className={styles.coinLabel}>🪙</span>
          </div>
        ))}
      </div>
    </div>
  )
}
