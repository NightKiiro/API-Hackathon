/**
 * utils/api.js — API Layer
 *
 * ALL communication with your hackathon API lives here.
 * The rest of the app never calls fetch() directly — it always
 * goes through these functions. This makes it easy to:
 *   - Swap the real API URL in one place
 *   - Add auth headers once
 *   - Handle errors consistently
 *
 * When your API is ready, set VITE_API_URL in a .env file:
 *   VITE_API_URL=https://your-api.epite.fr
 * Vite injects it at build time via import.meta.env.
 */

const BASE_URL = import.meta.env.VITE_API_URL || ''

// Helper: wraps fetch with error handling and JSON parsing
async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`)
  return res.json()
}

// ─── Game endpoints ────────────────────────────────────────────────────────

/**
 * Returns all games with their stats:
 * plays, wagered coins, profit, jackpot, status
 * Expected shape: Game[]
 * { id, name, type, team, emoji, plays, wagered, profit, jackpot, jackpotMax, status }
 */
export const fetchGames = () => apiFetch('/api/games')

/**
 * Returns stats for a single game (for creator view)
 * { ...game, profitHistory: number[], winRateDistribution: [lose%, small%, big%] }
 */
export const fetchGameById = (id) => apiFetch(`/api/games/${id}`)

// ─── Player endpoints ──────────────────────────────────────────────────────

/**
 * Returns players sorted by coins descending — the leaderboard
 * { id, name, initials, color, coins, plays, wins }
 */
export const fetchPlayers = () => apiFetch('/api/players/leaderboard')

// ─── Transaction endpoints ─────────────────────────────────────────────────

/**
 * Returns the most recent transactions across all games
 * { id, game, player, bet, result, gain, timestamp }
 */
export const fetchTransactions = (limit = 10) =>
  apiFetch(`/api/transactions?limit=${limit}`)

/**
 * Returns transactions for a specific game
 */
export const fetchGameTransactions = (gameId, limit = 10) =>
  apiFetch(`/api/games/${gameId}/transactions?limit=${limit}`)

// ─── Mock data (used when no API is configured) ───────────────────────────
// Remove these once your real API is live

export const MOCK_GAMES = [
  { id: 0, emoji: '🚀', name: 'StarForge', type: 'Tirage', team: 'NeonByte', plays: 312, wagered: 624, profit: 87, jackpot: 87, jackpotMax: 200, status: 'hot' },
  { id: 1, emoji: '🎴', name: 'Scratch & Win', type: 'Grattage', team: 'MazeX', plays: 278, wagered: 417, profit: 64, jackpot: 64, jackpotMax: 200, status: 'open' },
  { id: 2, emoji: '🎱', name: 'Loto Pixel', type: 'Tirage', team: 'PixelForge', plays: 244, wagered: 488, profit: 52, jackpot: 52, jackpotMax: 200, status: 'open' },
  { id: 3, emoji: '🎰', name: 'Jackpot 777', type: 'Machine', team: 'ByteTeam', plays: 201, wagered: 402, profit: 41, jackpot: 41, jackpotMax: 200, status: 'open' },
  { id: 4, emoji: '♠️', name: 'BlackCards', type: 'Grattage', team: 'CardTeam', plays: 188, wagered: 376, profit: 29, jackpot: 29, jackpotMax: 200, status: 'open' },
  { id: 5, emoji: '💀', name: 'SkullBet', type: 'Machine', team: 'DarkTeam', plays: 97, wagered: 194, profit: 0, jackpot: 0, jackpotMax: 200, status: 'closed' },
]

export const MOCK_PLAYERS = [
  { id: 1, name: 'Alex B.', initials: 'AB', color: '#7b5cff', coins: 38, plays: 24, wins: 18 },
  { id: 2, name: 'Sarah K.', initials: 'SK', color: '#00e5a0', coins: 34, plays: 31, wins: 22 },
  { id: 3, name: 'Marco D.', initials: 'MD', color: '#f5c842', coins: 31, plays: 19, wins: 11 },
  { id: 4, name: 'Léa R.', initials: 'LR', color: '#3b8fff', coins: 28, plays: 28, wins: 17 },
  { id: 5, name: 'Tom G.', initials: 'TG', color: '#ff4f4f', coins: 26, plays: 22, wins: 13 },
  { id: 6, name: 'Nina F.', initials: 'NF', color: '#f5a623', coins: 24, plays: 17, wins: 9 },
]

export const MOCK_TRANSACTIONS = [
  { id: 1, emoji: '🚀', game: 'StarForge', player: 'Alex B.', bet: 2, result: 'win', gain: 4, timestamp: new Date() },
  { id: 2, emoji: '🎴', game: 'Scratch & Win', player: 'Sarah K.', bet: 1, result: 'lose', gain: -1, timestamp: new Date(Date.now() - 12000) },
  { id: 3, emoji: '🎱', game: 'Loto Pixel', player: 'Marco D.', bet: 2, result: 'win', gain: 6, timestamp: new Date(Date.now() - 24000) },
  { id: 4, emoji: '🎰', game: 'Jackpot 777', player: 'Léa R.', bet: 1, result: 'lose', gain: -1, timestamp: new Date(Date.now() - 35000) },
  { id: 5, emoji: '♠️', game: 'BlackCards', player: 'Tom G.', bet: 2, result: 'win', gain: 3, timestamp: new Date(Date.now() - 41000) },
]

export const MOCK_CREATOR_STATS = [
  { profitHistory: [2,5,8,12,18,24,31,41,51,62,74,87], winRate: [55,30,15] },
  { profitHistory: [1,3,7,11,15,21,28,36,44,52,58,64], winRate: [50,32,18] },
  { profitHistory: [0,2,4,8,13,19,24,29,35,41,47,52], winRate: [60,28,12] },
  { profitHistory: [0,1,3,5,9,14,19,25,30,35,38,41], winRate: [65,25,10] },
]
