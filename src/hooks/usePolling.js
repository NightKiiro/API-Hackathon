/**
 * hooks/usePolling.js — Live Data Hook
 *
 * A "custom hook" is just a function that uses React hooks internally
 * and can be reused across components. This one:
 *
 *   1. Calls your fetcher function immediately
 *   2. Re-calls it every `intervalMs` milliseconds (polling)
 *   3. Tracks loading/error/data state
 *   4. Cleans up the interval when the component unmounts
 *
 * Usage:
 *   const { data, loading, error } = usePolling(fetchGames, 5000)
 *   → Calls fetchGames() now, then every 5 seconds
 */
import { useState, useEffect, useCallback } from 'react'

export function usePolling(fetchFn, intervalMs = 5000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // useCallback memoizes the fetch so it doesn't re-create on every render
  const load = useCallback(async () => {
    try {
      const result = await fetchFn()
      setData(result)
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    load() // Fetch immediately on mount

    // Set up the polling interval
    const interval = setInterval(load, intervalMs)

    // Cleanup: React calls this when the component unmounts
    // Without this, the interval would keep running in the background
    return () => clearInterval(interval)
  }, [load, intervalMs])

  return { data, loading, error, lastUpdated, refresh: load }
}
