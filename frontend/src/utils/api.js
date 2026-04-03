const API_BASE = import.meta.env.VITE_API_URL || '';

/* ---------------- API KEY ---------------- */

export function getApiKey() {
  return localStorage.getItem('epibet_api_key') || '';
}

export function setApiKey(key) {
  localStorage.setItem('epibet_api_key', key);
}

export function clearApiKey() {
  localStorage.removeItem('epibet_api_key');
}

/* ---------------- CORE REQUEST ---------------- */

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Erreur API');
  }

  return data;
}

async function authRequest(path, options = {}) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('Clé API manquante');
  }

  return request(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'X-API-Key': apiKey,
    },
  });
}

/* PUBLIC */
export const fetchPublicRanking = () => request('/public/ranking');
export const fetchPublicStats = () => request('/public/stats');
export const fetchPublicAlerts = () => request('/public/alerts');

export const fetchPublicRanking = () =>
  request('/public/ranking');

export const fetchPublicStats = () =>
  request('/public/stats');

export const fetchPublicAlerts = () =>
  request('/public/alerts');

/* ---------------- AUTH ---------------- */

export const registerCreator = (email) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const fetchMe = () =>
  authRequest('/auth/me');

export const fetchApiKeys = () =>
  authRequest('/auth/api-keys');

export const createApiKey = () =>
  authRequest('/auth/api-keys', {
    method: 'POST',
  });

/* ---------------- GAMES ---------------- */

export const fetchMyGames = () =>
  authRequest('/games/my-games');

export const fetchGameById = (gameId) =>
  authRequest(`/games/${gameId}`);

export const createGame = (payload) =>
  authRequest('/games', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

/* ---------------- CREATOR ---------------- */

export const fetchCreatorOverview = () =>
  authRequest('/creator/overview');

export const fetchCreatorGameStats = (gameId) =>
  authRequest(`/creator/games/${gameId}/stats`);

export const fetchCreatorGameTransactions = (gameId) =>
  authRequest(`/creator/games/${gameId}/transactions`);

export const fetchCreatorGameAlerts = (gameId) =>
  authRequest(`/creator/games/${gameId}/alerts`);

/* ---------------- TRANSACTIONS ---------------- */

export const createTransaction = (gameId, payload) =>
  authRequest(`/games/${gameId}/transactions`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });