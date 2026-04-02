/**
 * components/WinRateChart.jsx — Win Rate Donut Chart
 *
 * A PieChart with innerRadius > 0 becomes a donut chart.
 * The `winRate` prop is an array of 3 numbers that must sum to 100:
 *   [losePercent, smallWinPercent, bigWinPercent]
 * e.g. [55, 30, 15] means 55% lose, 30% small win, 15% big win
 */
import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import styles from './WinRateChart.module.css'

const SEGMENTS = [
  { label: 'Perte',      color: '#ff4f4f' },
  { label: 'Petit gain', color: '#f5c842' },
  { label: 'Gros gain',  color: '#00e5a0' },
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <span style={{ color: payload[0].payload.color }}>{payload[0].name}</span>
      <span className={styles.tooltipVal}> {payload[0].value}%</span>
    </div>
  )
}

export default function WinRateChart({ winRate = [60, 28, 12] }) {
  const data = SEGMENTS.map((seg, i) => ({
    name: seg.label,
    value: winRate[i] ?? 0,
    color: seg.color,
  }))

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>Distribution des résultats</div>
      <div className={styles.body}>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom legend */}
        <div className={styles.legend}>
          {data.map((d, i) => (
            <div key={i} className={styles.legendItem}>
              <span className={styles.dot} style={{ background: d.color }} />
              <span className={styles.legendLabel}>{d.name}</span>
              <span className={styles.legendVal} style={{ color: d.color }}>{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
