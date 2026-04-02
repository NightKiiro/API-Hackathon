/**
 * pages/Leaderboard.jsx — Public Leaderboard Page
 *
 * "Pages" are components tied to a URL route.
 * This one lives at /leaderboard.
 *
 * It uses our usePolling hook to:
 *   - Fetch games, players, and transactions from the API
 *   - Re-fetch every 5 seconds automatically
 *   - Show loading skeletons while data loads
 *
 * Data flow:
 *   API → usePolling → state → props → child components
 */
import React, { useCallback } from 'react'
import { fetchGames, fetchPlayers, fetchTransactions, MOCK_GAMES, MOCK_PLAYERS, MOCK_TRANSACTIONS } from '../utils/api'
import { usePolling } from '../hooks/usePolling'
import MetricCard from '../components/MetricCard'
import GameTable from '../components/GameTable'
import PlayerList from '../components/PlayerList'
import TransactionFeed from '../components/TransactionFeed'
import { formatNumber, formatCoins } from '../utils/format'
import styles from './Leaderboard.module.css'

// Toggle this to false when your real API is ready
const USE_MOCK = true

// Wrap mock fetches so they look like real async calls
const getMockGames = () => Promise.resolve(MOCK_GAMES)
const getMockPlayers = () => Promise.resolve(MOCK_PLAYERS)
const getMockTxs = () => Promise.resolve(MOCK_TRANSACTIONS)

export default function Leaderboard({ onDataLoaded }) {
  const {
    data: games,
    loading: gamesLoading,
  } = usePolling(USE_MOCK ? getMockGames : fetchGames, 5000)

  const {
    data: players,
    loading: playersLoading,
    lastUpdated,
  } = usePolling(USE_MOCK ? getMockPlayers : fetchPlayers, 5000)

  const {
    data: transactions,
    loading: txLoading,
  } = usePolling(USE_MOCK ? getMockTxs : fetchTransactions, 3000)

  // Notify parent (App.jsx) of lastUpdated so Navbar can show it
  React.useEffect(() => {
    if (lastUpdated && onDataLoaded) onDataLoaded(lastUpdated)
  }, [lastUpdated, onDataLoaded])

  // Derived metrics computed from the games array
  const totalWagered = games?.reduce((s, g) => s + g.wagered, 0) ?? 0
  const openGames = games?.filter(g => g.status !== 'closed').length ?? 0
  const biggestJackpot = games ? Math.max(...games.map(g => g.jackpot)) : 0
  const biggestGame = games?.find(g => g.jackpot === biggestJackpot)

  if (gamesLoading) {
    return <div className={styles.loading}>Chargement des données…</div>
  }

  return (
    <main className={styles.page}>
      {/* Top metrics row */}
      <div className={styles.metrics}>
        <MetricCard
          label="Jeux actifs"
          value={openGames}
          sub={`${games?.length ?? 0} jeux au total`}
          color="var(--purple)"
          accent
        />
        <MetricCard
          label="Mises totales"
          value={formatCoins(totalWagered)}
          sub="session en cours"
          subUp
          color="var(--gold)"
          accent
        />
        <MetricCard
          label="Joueurs actifs"
          value={formatNumber(players?.length ?? 0)}
          sub="classés par pièces"
          color="var(--green)"
          accent
        />
        <MetricCard
          label="Plus gros jackpot"
          value={formatCoins(biggestJackpot)}
          sub={biggestGame?.name ?? ''}
          color="var(--gold)"
          accent
        />
      </div>

      {/* Sortable game table */}
      <GameTable games={games ?? []} />

      {/* Bottom two-column layout */}
      <div className={styles.bottomGrid}>
        <PlayerList players={players ?? []} />
        <TransactionFeed transactions={transactions ?? []} />
      </div>
    </main>
  )
}
