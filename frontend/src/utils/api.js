const API_BASE = import.meta.env.VITE_API_URL || 'http://10.79.215.134:8000'

export function getApiKey() {
  return localStorage.getItem('epibet_api_key') || ''
}

export function setApiKey(key) {
  localStorage.setItem('epibet_api_key', key)
}

export function clearApiKey() {
  localStorage.removeItem('epibet_api_key')
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Erreur API')
  }

  return data
}

async function authRequest(path, options = {}) {
  const apiKey = getApiKey()

  if (!apiKey) {
    throw new Error('Clé API manquante')
  }

  return request(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'X-API-Key': apiKey,
    },
  })
}

/* ---------------- PUBLIC ---------------- */

export async function fetchPublicRanking() {
  return request('/public/ranking')
}

export async function fetchPublicStats() {
  return request('/public/stats')
}

export async function fetchPublicAlerts() {
  return request('/public/alerts')
}

/* ---------------- AUTH ---------------- */

export async function registerCreator(email) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function fetchMe() {
  return authRequest('/auth/me')
}

export async function fetchApiKeys() {
  return authRequest('/auth/api-keys')
}

export async function createApiKey() {
  return authRequest('/auth/api-keys', {
    method: 'POST',
  })
}

/* ---------------- GAMES / CREATOR ---------------- */

export async function fetchMyGames() {
  return authRequest('/games/my-games')
}

export async function fetchGameById(gameId) {
  return authRequest(`/games/${gameId}`)
}

export async function fetchCreatorOverview() {
  return authRequest('/creator/overview')
}

export async function fetchCreatorGameStats(gameId) {
  return authRequest(`/creator/games/${gameId}/stats`)
}

export async function fetchCreatorGameTransactions(gameId) {
  return authRequest(`/creator/games/${gameId}/transactions`)
}

export async function fetchCreatorGameAlerts(gameId) {
  return authRequest(`/creator/games/${gameId}/alerts`)
}

export async function createGame(payload) {
  return authRequest('/games', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* ---------------- TRANSACTIONS ---------------- */

export async function createTransaction(gameId, payload) {
  return authRequest(`/games/${gameId}/transactions`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}