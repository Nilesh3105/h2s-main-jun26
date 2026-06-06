import './SeasonBanner.css'

import type { SeasonStatus } from '../lib/types'

export interface SeasonBannerProps {
  season: SeasonStatus
}

/**
 * A gentle, supportive banner shown during the run-up to an exam or the days
 * after a result — when extra support matters most (research/01).
 */
export function SeasonBanner({ season }: SeasonBannerProps) {
  if (!season.active) {
    return null
  }
  return (
    <div className="season-banner" role="status">
      <p className="season-banner__label">{season.label}</p>
      <p className="season-banner__message">{season.message}</p>
    </div>
  )
}
