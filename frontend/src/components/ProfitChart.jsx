/**
 * components/ProfitChart.jsx — Profit Over Time (Line Chart)
 *
 * We use Recharts — a React-native charting library.
 * Recharts works with declarative JSX: you describe WHAT you want,
 * it figures out HOW to draw it. Much easier than Chart.js in React.
 *
 * Key Recharts components:
 *   <ResponsiveContainer> → makes chart fill its parent's width
 *   <LineChart>           → the chart type
 *   <XAxis> / <YAxis>    → the axes
 *   <Tooltip>            → hover popup with values
 *   <Line>               → the actual data line
 */
import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import styles from './ProfitChart.module.css'

// Custom tooltip shown on hover
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      <div className={styles.tooltipValue}>+{payload[0].value} 🪙</div>
    </div>
  )
}

export default function ProfitChart({ history = [] }) {
  // Transform raw array [2, 5, 8, ...] into Recharts format
  // Recharts needs: [{ label: 'T+1', value: 2 }, { label: 'T+2', value: 5 }, ...]
  const data = history.map((value, i) => ({
    label: `T+${i + 1}`,
    profit: value,
  }))

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>Profit cumulé (pièces)</div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#8888aa', fontSize: 9, fontFamily: 'DM Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8888aa', fontSize: 9, fontFamily: 'DM Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#00e5a0"
            strokeWidth={2}
            dot={{ r: 3, fill: '#00e5a0', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
