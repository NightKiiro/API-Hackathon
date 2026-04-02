/**
 * main.jsx — Entry point
 *
 * This is the very first file React runs.
 * It mounts our <App> into the #root div in index.html.
 * We wrap everything with <BrowserRouter> so react-router-dom
 * can handle URL navigation (/leaderboard, /my-game, etc.)
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
