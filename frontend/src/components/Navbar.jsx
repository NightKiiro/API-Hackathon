import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar({ lastUpdated }) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        EPITE <span className={styles.logoAccent}>CASINO</span>
        <span className={styles.live}>
          <span className={styles.liveDot} />
          LIVE
        </span>
      </div>

      <div className={styles.links}>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.linkActive}` : styles.link
          }
        >
          Classement
        </NavLink>

        <NavLink
          to="/my-game"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.linkActive}` : styles.link
          }
        >
          Mon Jeu
        </NavLink>

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.linkActive}` : styles.link
          }
        >
          Admin
        </NavLink>
      </div>

      {timeStr && <div className={styles.updated}>Màj {timeStr}</div>}
    </nav>
  )
}