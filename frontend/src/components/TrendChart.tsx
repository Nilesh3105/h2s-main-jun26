import './TrendChart.css'

import type { TrendPoint } from '../lib/types'

export interface TrendChartProps {
  points: TrendPoint[]
  summary: string
}

// Viewbox the SVG draws into; coordinates are computed from the data so the
// chart stays crisp at any rendered size via preserveAspectRatio.
const VIEW_WIDTH = 300
const VIEW_HEIGHT = 100
const PADDING = 8
const MOOD_MIN = 1
const MOOD_MAX = 5

/** Map a mood value (1 at bottom, 5 at top) to a y coordinate in the viewBox. */
function moodToY(mood: number): number {
  const clamped = Math.min(MOOD_MAX, Math.max(MOOD_MIN, mood))
  const ratio = (clamped - MOOD_MIN) / (MOOD_MAX - MOOD_MIN)
  return VIEW_HEIGHT - PADDING - ratio * (VIEW_HEIGHT - 2 * PADDING)
}

/** Evenly space points across the width; a single point sits in the middle. */
function indexToX(index: number, total: number): number {
  if (total <= 1) {
    return VIEW_WIDTH / 2
  }
  const step = (VIEW_WIDTH - 2 * PADDING) / (total - 1)
  return PADDING + index * step
}

/**
 * An accessible mood trend chart. Meaning never lives in the SVG alone: a plain
 * text summary leads, a real data table carries the values, and the SVG is a
 * decorative, aria-hidden visualisation layered on top.
 */
export function TrendChart({ points, summary }: TrendChartProps) {
  if (points.length === 0) {
    return (
      <p className="trend__empty">
        A day or two of check-ins and your mood trend will show up here.
      </p>
    )
  }

  const coords = points.map((point, index) => ({
    x: indexToX(index, points.length),
    y: moodToY(point.mood),
  }))
  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ')

  return (
    <div className="trend">
      <p className="trend__summary">{summary}</p>
      <svg
        className="trend__svg"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {coords.length > 1 ? (
          <polyline
            className="trend__line"
            points={polylinePoints}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        {coords.map((c, index) => (
          <circle key={index} className="trend__dot" cx={c.x} cy={c.y} r={3} fill="var(--accent)" />
        ))}
      </svg>
      <details className="trend__table">
        <summary>View data table</summary>
        <table>
          <caption>Mood by day</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Mood (avg)</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.date}>
                <td>{point.date}</td>
                <td>{point.mood.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}
