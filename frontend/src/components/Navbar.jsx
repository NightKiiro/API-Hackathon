/**
 * components/Navbar.jsx — Top Navigation Bar
 *
 * A "component" is a reusable UI piece — like a LEGO brick.
 * This one renders the top bar with:
 *   - The site logo
 *   - Navigation links (using react-router-dom's <NavLink>)
 *   - A live indicator that pulses green
 *
 * <NavLink> is like <a> but it automatically adds an "active" CSS class
 * when its URL matches the current page — no manual tracking needed.
 */
import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar({ lastUpdated }) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        EPI BET <span className={styles.logoAccent}>CASINO</span>
        <span className={styles.live}>
          <span className={styles.liveDot} />
          LIVE
        </span>
      </div>

      <div className={styles.links}>
        {/* NavLink automatically gets class "active" when route matches */}
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
      </div>

      {timeStr && (
        <div className={styles.updated}>
          Màj {timeStr}
        </div>
      )}
    </nav>
  )
}
