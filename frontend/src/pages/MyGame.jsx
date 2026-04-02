/**
 * pages/MyGame.jsx — Creator Dashboard (/my-game)
 *
 * This page is for game creators to monitor their own game.
 * New concepts here:
 *
 *   - Controlled select: the dropdown's value is stored in state.
 *     When the user picks a different game, state updates →
 *     React re-renders → the right game's data shows up.
 *
 *   - Dependent fetching: we fetch the selected game's detailed
 *     stats (profit history, win rate) only when gameId changes.
 *     usePolling's fetchFn is recreated with useCallback when
 *     gameId changes, which triggers a new fetch automatically.
 */
import React, { useState, useCallback } from 'react'
import {
  fetchGames, fetchGameById, fetchGameTransactions,
  MOCK_GAMES, MOCK_CREATOR_STATS, MOCK_TRANSACTIONS
} from '../utils/api'
import { usePolling } from '../hooks/usePolling'
import MetricCard from '../components/MetricCard'
import JackpotAlert from '../components/JackpotAlert'
import ProfitChart from '../components/ProfitChart'
import WinRateChart from '../components/WinRateChart'
import TransactionFeed from '../components/TransactionFeed'
import { formatCoins, formatNumber, jackpotPct } from '../utils/format'
import styles from './MyGame.module.css'

const USE_MOCK = true

const getMockGames = () => Promise.resolve(MOCK_GAMES)

export default function MyGame() {
  // Which game is selected — 0 by default
  const [gameId, setGameId] = useState(0)

  // Fetch the list of games for the dropdown selector
  const { data: games } = usePolling(USE_MOCK ? getMockGames : fetchGames, 10000)

  // useCallback: re-creates this function ONLY when gameId changes
  // This tells usePolling "fetch a different URL now"
  const fetchSelected = useCallback(
    () => USE_MOCK
      ? Promise.resolve({ ...MOCK_GAMES[gameId], ...MOCK_CREATOR_STATS[gameId] })
      : fetchGameById(gameId),
    [gameId]
  )

  const fetchSelectedTx = useCallback(
    () => USE_MOCK
      ? Promise.resolve(MOCK_TRANSACTIONS)
      : fetchGameTransactions(gameId),
    [gameId]
  )

  const { data: game, loading } = usePolling(fetchSelected, 5000)
  const { data: transactions } = usePolling(fetchSelectedTx, 4000)

  const pct = game ? jackpotPct(game.jackpot, game.jackpotMax) : 0

  if (loading || !game) {
    return <div className={styles.loading}>Chargement de votre jeu…</div>
  }

  return (
    <main className={styles.page}>

      {/* Game selector header */}
      <div className={styles.header}>
        <div className={styles.gameIcon}>{game.emoji}</div>
        <div>
          <h1 className={styles.gameName}>{game.name}</h1>
          <div className={styles.gameMeta}>{game.type} · Équipe {game.team}</div>
        </div>

        {/* Controlled select — value tied to state */}
        <select
          className={styles.gameSelect}
          value={gameId}
          onChange={e => setGameId(Number(e.target.value))}
        >
          {(games ?? []).map(g => (
            <option key={g.id} value={g.id}>
              {g.emoji} {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Alert shown if jackpot is critical */}
      <JackpotAlert jackpot={game.jackpot} />

      {/* Jackpot health bar */}
      <div className={styles.jackpotBar}>
        <div className={styles.jackpotBarLabels}>
          <span className={styles.jackpotBarLabel}>Jackpot restant</span>
          <span className={styles.jackpotBarValue}>{formatCoins(game.jackpot)} / {formatCoins(game.jackpotMax)}</span>
        </div>
        <div className={styles.jackpotTrack}>
          <div
            className={styles.jackpotFill}
            style={{
              width: `${pct}%`,
              background: pct > 50 ? 'var(--green)' : pct > 20 ? 'var(--gold)' : 'var(--red)'
            }}
          />
        </div>
        <div className={styles.jackpotPct}>{pct}% restant</div>
      </div>

      {/* Key metrics */}
      <div className={styles.metrics}>
        <MetricCard
          label="Profit net"
          value={`+${formatCoins(game.profit)}`}
          sub="bénéfice total"
          subUp
          color="var(--green)"
          accent
        />
        <MetricCard
          label="Participations"
          value={formatNumber(game.plays)}
          sub="popularité"
          color="var(--purple)"
          accent
        />
        <MetricCard
          label="Mises encaissées"
          value={formatCoins(game.wagered)}
          sub="wagered total"
          color="var(--gold)"
          accent
        />
        <MetricCard
          label="Statut"
          value={game.status === 'closed' ? 'Fermé' : game.status === 'hot' ? 'Hot 🔥' : 'Ouvert'}
          sub={game.status === 'closed' ? 'jackpot épuisé' : 'en cours'}
          color={game.status === 'closed' ? 'var(--red)' : game.status === 'hot' ? 'var(--gold)' : 'var(--green)'}
          accent
        />
      </div>

      {/* Charts row */}
      <div className={styles.chartsRow}>
        <ProfitChart history={game.profitHistory ?? []} />
        <WinRateChart winRate={game.winRate ?? [60, 28, 12]} />
      </div>

      {/* Recent transactions for this game */}
      <TransactionFeed
        transactions={transactions ?? []}
        title={`⚡ Transactions — ${game.name}`}
      />
    </main>
  )
}
