import React from 'react'
import {
  fetchPublicRanking,
  fetchPublicStats,
  fetchPublicAlerts,
} from '../utils/api'
import { usePolling } from '../hooks/usePolling'
import MetricCard from '../components/MetricCard'
import GameTable from '../components/GameTable'
import TransactionFeed from '../components/TransactionFeed'
import JackpotAlert from '../components/JackpotAlert'
import { formatCoins, formatNumber } from '../utils/format'
import styles from './Leaderboard.module.css'

export default function Leaderboard({ onDataLoaded }) {
  const {
    data: ranking,
    loading: rankingLoading,
    lastUpdated,
  } = usePolling(fetchPublicRanking, 5000)

  const {
    data: stats,
    loading: statsLoading,
  } = usePolling(fetchPublicStats, 5000)

  const {
    data: alerts,
    loading: alertsLoading,
  } = usePolling(fetchPublicAlerts, 5000)

  React.useEffect(() => {
    if (lastUpdated && onDataLoaded) {
      onDataLoaded(lastUpdated)
    }
  }, [lastUpdated, onDataLoaded])

  const games = ranking ?? []
  const publicStats = stats ?? {
    total_games: 0,
    active_games: 0,
    closed_games: 0,
    total_jackpot: 0,
    total_income: 0,
    total_payouts: 0,
    total_transactions: 0,
  }

  const closedAlerts = (alerts ?? []).filter((a) =>
    a.message?.toLowerCase().includes('closed') ||
    a.message?.toLowerCase().includes('jackpot')
  )

  if (rankingLoading || statsLoading || alertsLoading) {
    return <div className={styles.loading}>Chargement du classement…</div>
  }

  return (
    <main className={styles.page}>
      <div className={styles.metrics}>
        <MetricCard
          label="Jeux actifs"
          value={formatNumber(publicStats.active_games)}
          sub={`${formatNumber(publicStats.total_games)} jeux au total`}
          color="var(--green)"
          accent
        />
        <MetricCard
          label="Jeux fermés"
          value={formatNumber(publicStats.closed_games)}
          sub="jackpot à 0"
          color="var(--red)"
          accent
        />
        <MetricCard
          label="Parties jouées"
          value={formatNumber(publicStats.total_plays ?? publicStats.total_transactions)}
          sub="transactions totales"
          color="var(--blue)"
          accent
        />
        <MetricCard
          label="Pièces encaissées"
          value={formatCoins(publicStats.total_income)}
          sub="revenus globaux"
          color="var(--gold)"
          accent
        />
        <MetricCard
          label="Jackpot cumulé"
          value={formatCoins(publicStats.total_jackpot)}
          sub={`${formatNumber(publicStats.total_transactions)} transactions`}
          color="var(--purple)"
          accent
        />
      </div>

      {closedAlerts.length > 0 && (
        <div className={styles.alerts}>
          {closedAlerts.slice(0, 3).map((alert) => (
            <JackpotAlert key={alert.id} jackpot={0} />
          ))}
        </div>
      )}

      <GameTable games={games} />

      <div className={styles.bottomGrid}>
        <TransactionFeed
          title="⚡ Dernières transactions de la plateforme"
          transactions={games.flatMap((game) => {
            return game.last_transactions ?? []
          })}
        />

        <div className={styles.sidePanel}>
          <div className={styles.panelTitle}>🚨 Alertes récentes</div>
          <div className={styles.alertList}>
            {(alerts ?? []).length === 0 && (
              <div className={styles.empty}>Aucune alerte active</div>
            )}

            {(alerts ?? []).map((alert) => (
              <div key={alert.id} className={styles.alertRow}>
                <div className={styles.alertMessage}>{alert.message}</div>
                <div className={styles.alertMeta}>
                  Jeu #{alert.game_id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}