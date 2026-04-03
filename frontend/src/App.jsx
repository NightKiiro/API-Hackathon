import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Leaderboard from './pages/Leaderboard'
import MyGame from './pages/MyGame'
import Admin from './pages/Admin'
import styles from './App.module.css'

export default function App() {
  const [lastUpdated, setLastUpdated] = useState(null)

  return (
    <div className={styles.app}>
      <Navbar lastUpdated={lastUpdated} />

      <Routes>
        <Route path="/" element={<Navigate to="/leaderboard" replace />} />
        <Route
          path="/leaderboard"
          element={<Leaderboard onDataLoaded={setLastUpdated} />}
        />
        <Route path="/my-game" element={<MyGame />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/leaderboard" replace />} />
      </Routes>
    </div>
  )
}