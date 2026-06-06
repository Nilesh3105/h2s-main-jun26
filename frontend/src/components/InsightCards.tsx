import './InsightCards.css'

import type { InsightCard } from '../lib/types'

export interface InsightCardsProps {
  cards: InsightCard[]
}

// A text label per tone so meaning never rests on colour alone.
const TONE_LABEL: Record<InsightCard['tone'], string> = {
  positive: 'Good news',
  watch: 'Worth noticing',
  neutral: 'Note',
}

export function InsightCards({ cards }: InsightCardsProps) {
  return (
    <section className="insight-cards" aria-labelledby="insights-heading">
      <h2 id="insights-heading">Patterns we noticed</h2>
      {cards.length === 0 ? (
        <p className="insight-cards__empty">
          Keep checking in for a few days and gentle, useful patterns will show up here.
        </p>
      ) : (
        <ul className="insight-cards__list">
          {cards.map((card) => (
            <li key={card.title} className={`insight-card insight-card--${card.tone}`}>
              <p className="insight-card__tone">{TONE_LABEL[card.tone]}</p>
              <h3>{card.title}</h3>
              <p>{card.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
