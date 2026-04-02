/**
 * components/JackpotAlert.jsx — Jackpot Warning Banner
 *
 * Conditional rendering in action:
 * If jackpot === 0    → show red "GAME OVER" banner
 * If jackpot < 20     → show orange warning
 * Otherwise           → render nothing (return null)
 *
 * Returning null from a component renders nothing — React's way
 * of saying "don't show this right now".
 */
import React from 'react'
import styles from './JackpotAlert.module.css'

export default function JackpotAlert({ jackpot }) {
  if (jackpot === 0) {
    return (
      <div className={`${styles.alert} ${styles.danger}`}>
        <span className={styles.icon}>🚨</span>
        <div>
          <div className={styles.alertTitle}>Jackpot épuisé — Jeu fermé !</div>
          <div className={styles.alertSub}>
            Plus aucun joueur ne peut participer. Votre jeu est terminé.
          </div>
        </div>
      </div>
    )
  }

  if (jackpot < 20) {
    return (
      <div className={`${styles.alert} ${styles.warning}`}>
        <span className={styles.icon}>⚠️</span>
        <div>
          <div className={styles.alertTitle}>Jackpot critique : {jackpot} 🪙 restantes</div>
          <div className={styles.alertSub}>
            Attention — vous ne pouvez pas promettre un gain supérieur à votre jackpot actuel.
          </div>
        </div>
      </div>
    )
  }

  // Return null = don't render anything
  return null
}
