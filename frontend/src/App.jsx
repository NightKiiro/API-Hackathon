/**
 * App.jsx — Root Component & Router
 *
 * This is the heart of the app. It:
 *   1. Sets up routing with react-router-dom's <Routes> and <Route>
 *   2. Renders the Navbar on every page
 *   3. Passes `lastUpdated` to Navbar so it shows the refresh time
 *
 * How routing works:
 *   URL /leaderboard → renders <Leaderboard />
 *   URL /my-game     → renders <MyGame />
 *   URL /            → redirects to /leaderboard
 *
 * <Navigate> is react-router-dom's redirect component.
 */
import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Leaderboard from './pages/Leaderboard'
import MyGame from './pages/MyGame'
import styles from './App.module.css'

export default function App() {
  // lastUpdated is set by Leaderboard when its data refreshes
  // We lift it up here so Navbar (a sibling) can display it
  const [lastUpdated, setLastUpdated] = useState(null)

  return (
    <div className={styles.app}>
      <Navbar lastUpdated={lastUpdated} />

      {/*
        <Routes> looks at the current URL and renders the matching <Route>.
        Only ONE route renders at a time.
      */}
      <Routes>
        {/* Redirect / → /leaderboard */}
        <Route path="/" element={<Navigate to="/leaderboard" replace />} />

        {/* Public leaderboard */}
        <Route
          path="/leaderboard"
          element={<Leaderboard onDataLoaded={setLastUpdated} />}
        />

        {/* Creator dashboard */}
        <Route path="/my-game" element={<MyGame />} />

        {/* Catch-all: unknown URLs → back to leaderboard */}
        <Route path="*" element={<Navigate to="/leaderboard" replace />} />
      </Routes>
    </div>
  )
}
