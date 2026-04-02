import React, { useState, useCallback, useMemo } from 'react'
import {
  getApiKey,
  setApiKey,
  clearApiKey,
  fetchMyGames,
  fetchCreatorOverview,
  fetchCreatorGameStats,
  fetchCreatorGameTransactions,
} from '../utils/api'
import { usePolling } from '../hooks/usePolling'
import MetricCard from '../components/MetricCard'
import JackpotAlert from '../components/JackpotAlert'
import TransactionFeed from '../components/TransactionFeed'
import { formatCoins, formatNumber } from '../utils/format'
import styles from './MyGame.module.css'

export default function MyGame() {
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey())
  const [savedApiKey, setSavedApiKey] = useState(getApiKey())
  const [selectedGameId, setSelectedGameId] = useState(null)
  const [authError, setAuthError] = useState('')

  const saveKey = () => {
    setApiKey(apiKeyInput.trim())
    setSavedApiKey(apiKeyInput.trim())
    setAuthError('')
  }

  const logoutKey = () => {
    clearApiKey()
    setApiKeyInput('')
    setSavedApiKey('')
    setSelectedGameId(null)
  }

  const fetchGames = useCallback(async () => {
    if (!savedApiKey) return []
    return fetchMyGames()
  }, [savedApiKey])

  const fetchOverview = useCallback(async () => {
    if (!savedApiKey) return null
    return fetchCreatorOverview()
  }, [savedApiKey])

  const {
    data: myGames,
    loading: gamesLoading,
    error: gamesError,
  } = usePolling(fetchGames, savedApiKey ? 5000 : null)

  const {
    data: overview,
    loading: overviewLoading,
    error: overviewError,
  } = usePolling(fetchOverview, savedApiKey ? 5000 : null)

  React.useEffect(() => {
    if (myGames?.length && (selectedGameId === null || !myGames.find(g => g.id === selectedGameId))) {
      setSelectedGameId(myGames[0].id)
    }
  }, [myGames, selectedGameId])

  const fetchSelectedStats = useCallback(async () => {
    if (!savedApiKey || !selectedGameId) return null
    return fetchCreatorGameStats(selectedGameId)
  }, [savedApiKey, selectedGameId])

  const fetchSelectedTransactions = useCallback(async () => {
    if (!savedApiKey || !selectedGameId) return []
    return fetchCreatorGameTransactions(selectedGameId)
  }, [savedApiKey, selectedGameId])

  const {
    data: game,
    loading: gameLoading,
    error: gameError,
  } = usePolling(fetchSelectedStats, savedApiKey && selectedGameId ? 4000 : null)

  const {
    data: transactions,
    loading: txLoading,
    error: txError,
  } = usePolling(fetchSelectedTransactions, savedApiKey && selectedGameId ? 3000 : null)

  React.useEffect(() => {
    const err = gamesError || overviewError || gameError || txError
    if (err) setAuthError(err.message)
  }, [gamesError, overviewError, gameError, txError])

  const summary = overview?.summary ?? {
    total_games: 0,
    total_current_jackpot: 0,
    total_income: 0,
    total_payout: 0,
    total_net_revenue: 0,
  }

  if (!savedApiKey) {
    return (
      <main className={styles.page}>
        <div className={styles.authBox}>
          <h1 className={styles.title}>Mon Jeu</h1>
          <p className={styles.subtitle}>
            Collez votre clé API créateur pour accéder à vos statistiques.
          </p>

          <input
            className={styles.apiInput}
            type="text"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="epibet_xxxxxxxxx"
          />

          <button className={styles.primaryBtn} onClick={saveKey}>
            Enregistrer la clé API
          </button>

          {authError && <div className={styles.error}>{authError}</div>}
        </div>
      </main>
    )
  }

  if (gamesLoading || overviewLoading || gameLoading || txLoading) {
    return <div className={styles.loading}>Chargement de vos statistiques…</div>
  }

  if (!myGames || myGames.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.authBar}>
          <button className={styles.secondaryBtn} onClick={logoutKey}>
            Changer de clé API
          </button>
        </div>

        <div className={styles.emptyState}>
          <h1>Aucun jeu trouvé</h1>
          <p>Créez un jeu depuis votre backend puis revenez ici.</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.authBar}>
        <div className={styles.authLabel}>Clé API active</div>
        <button className={styles.secondaryBtn} onClick={logoutKey}>
          Changer de clé API
        </button>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.gameName}>Dashboard créateur</h1>
          <div className={styles.gameMeta}>
            Suivi en direct de vos jeux et de leurs transactions
          </div>
        </div>

        <select
          className={styles.gameSelect}
          value={selectedGameId ?? ''}
          onChange={(e) => setSelectedGameId(Number(e.target.value))}
        >
          {(myGames ?? []).map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.metrics}>
        <MetricCard
          label="Nombre de jeux"
          value={formatNumber(summary.total_games)}
          sub="sur ce compte"
          color="var(--purple)"
          accent
        />
        <MetricCard
          label="Jackpot cumulé"
          value={formatCoins(summary.total_current_jackpot)}
          sub="sur tous vos jeux"
          color="var(--gold)"
          accent
        />
        <MetricCard
          label="Revenus totaux"
          value={formatCoins(summary.total_income)}
          sub="transactions income"
          color="var(--green)"
          accent
        />
        <MetricCard
          label="Net total"
          value={formatCoins(summary.total_net_revenue)}
          sub="income - payout"
          color="var(--gold)"
          accent
        />
      </div>

      {game && (
        <>
          <JackpotAlert jackpot={game.current_jackpot} />

          <div className={styles.metrics}>
            <MetricCard
              label="Jeu"
              value={game.name}
              sub={game.status === 'closed' ? 'fermé' : 'actif'}
              color={game.status === 'closed' ? 'var(--red)' : 'var(--green)'}
              accent
            />
            <MetricCard
              label="Jackpot restant"
              value={formatCoins(game.current_jackpot)}
              sub={`initial: ${formatCoins(game.initial_jackpot)}`}
              color="var(--gold)"
              accent
            />
            <MetricCard
              label="Pièces encaissées"
              value={formatCoins(game.total_income)}
              sub={`${formatNumber(game.total_transactions)} transactions`}
              color="var(--green)"
              accent
            />
            <MetricCard
              label="Pièces versées"
              value={formatCoins(game.total_payout)}
              sub={`net: ${formatCoins(game.net_revenue)}`}
              color="var(--red)"
              accent
            />
          </div>
        </>
      )}

      <TransactionFeed
        title={game ? `⚡ Transactions — ${game.name}` : '⚡ Transactions'}
        transactions={transactions ?? []}
      />

      {authError && <div className={styles.error}>{authError}</div>}
    </main>
  )
}