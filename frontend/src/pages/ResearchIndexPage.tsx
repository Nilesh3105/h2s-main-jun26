import './ResearchIndexPage.css'

import { Link } from 'react-router-dom'

import { RESEARCH_DOCS } from '../content/research'

/**
 * Browsable index of the cited research base. Each entry opens an in-app reader
 * (the markdown rendered as a page); the source files also live in the repo's
 * research/ folder.
 */
export function ResearchIndexPage() {
  return (
    <div className="research-index">
      <p className="research-index__back">
        <Link to="/approach">&larr; Our approach</Link>
      </p>
      <h2>The research behind Soft Reset</h2>
      <p className="research-index__intro">
        Every design choice here traces to evidence. These are the notes we compiled — the
        mental-health reality for exam aspirants, what support actually works, the app landscape,
        safety and privacy, and accessibility. Read any of them below.
      </p>

      <ul className="research-index__list">
        {RESEARCH_DOCS.map((doc) => (
          <li key={doc.slug} className="research-index__card">
            <h3>
              <Link to={`/approach/research/${doc.slug}`}>{doc.title}</Link>
            </h3>
            <p>{doc.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
