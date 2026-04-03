import React, { useState } from 'react'
import styles from './Admin.module.css'

const API_BASE = import.meta.env.VITE_API_URL || ''

function getAdminToken() {
  return localStorage.getItem('epibet_admin_token') || ''
}

function setAdminToken(token) {
  localStorage.setItem('epibet_admin_token', token)
}

async function adminRequest(path, options = {}) {
  const token = getAdminToken()

  if (!token) {
    throw new Error('Admin token manquant')
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': token,
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || data.details || 'Erreur admin')
  }

  return data
}

export default function Admin() {
  const [tokenInput, setTokenInput] = useState(getAdminToken())
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [readSql, setReadSql] = useState('SELECT id, email FROM creators ORDER BY id ASC')
  const [writeSql, setWriteSql] = useState("UPDATE games SET current_jackpot = 30 WHERE id = 1")

  const saveToken = () => {
    setAdminToken(tokenInput.trim())
    setError('')
  }

  const run = async (fn) => {
    try {
      setLoading(true)
      setError('')
      const data = await fn()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Admin</h1>
          <p className={styles.subtitle}>Accès debug / supervision hackathon</p>
        </div>
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Admin Token</h2>
        <div className={styles.row}>
          <input
            className={styles.input}
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="super_admin_hackathon_2026"
          />
          <button className={styles.primaryBtn} onClick={saveToken}>
            Enregistrer
          </button>
        </div>
      </section>

      <section className={styles.grid}>
        <button className={styles.actionBtn} onClick={() => run(() => adminRequest('/admin/overview'))}>
          Overview
        </button>
        <button className={styles.actionBtn} onClick={() => run(() => adminRequest('/admin/creators'))}>
          Creators
        </button>
        <button className={styles.actionBtn} onClick={() => run(() => adminRequest('/admin/games'))}>
          Games
        </button>
        <button className={styles.actionBtn} onClick={() => run(() => adminRequest('/admin/transactions'))}>
          Transactions
        </button>
        <button className={styles.actionBtn} onClick={() => run(() => adminRequest('/admin/alerts'))}>
          Alerts
        </button>
        <button
          className={`${styles.actionBtn} ${styles.dangerBtn}`}
          onClick={() => run(() => adminRequest('/admin/reset-db', { method: 'POST' }))}
        >
          Reset DB
        </button>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>SQL Lecture</h2>
        <textarea
          className={styles.textarea}
          value={readSql}
          onChange={(e) => setReadSql(e.target.value)}
        />
        <button
          className={styles.primaryBtn}
          onClick={() =>
            run(() =>
              adminRequest('/admin/query', {
                method: 'POST',
                body: JSON.stringify({ sql: readSql }),
              })
            )
          }
        >
          Exécuter SELECT
        </button>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>SQL Modification</h2>
        <textarea
          className={styles.textarea}
          value={writeSql}
          onChange={(e) => setWriteSql(e.target.value)}
        />
        <button
          className={`${styles.primaryBtn} ${styles.warningBtn}`}
          onClick={() =>
            run(() =>
              adminRequest('/admin/execute', {
                method: 'POST',
                body: JSON.stringify({ sql: writeSql }),
              })
            )
          }
        >
          Exécuter INSERT / UPDATE / DELETE
        </button>
      </section>

      {loading && <div className={styles.status}>Chargement…</div>}
      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Résultat</h2>
        <pre className={styles.result}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </section>
    </main>
  )
}