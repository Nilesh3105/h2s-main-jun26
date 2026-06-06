import './App.css'

import { Suspense, lazy } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import { ApproachPage } from './pages/ApproachPage'
import { CheckInPage } from './pages/CheckInPage'
import { CrisisPage } from './pages/CrisisPage'
import { DashboardPage } from './pages/DashboardPage'

// Lazy-load the research reader so its markdown renderer stays out of the main
// bundle — it only loads when someone actually browses the research.
const ResearchIndexPage = lazy(() =>
  import('./pages/ResearchIndexPage').then((m) => ({ default: m.ResearchIndexPage })),
)
const ResearchDocPage = lazy(() =>
  import('./pages/ResearchDocPage').then((m) => ({ default: m.ResearchDocPage })),
)

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="app-header__bar">
            <div>
              <h1>Soft Reset</h1>
              <p className="tagline">
                A private, judgment-free space to check in on how you&rsquo;re doing.
              </p>
            </div>
            {/* Always one tap away — a deep-linkable, offline-capable crisis screen. */}
            <NavLink to="/help" className="help-toggle">
              Need to talk now?
            </NavLink>
          </div>

          <nav className="app-nav" aria-label="Primary">
            <NavLink to="/" end>
              Check in
            </NavLink>
            <NavLink to="/trends">Trends</NavLink>
            <NavLink to="/help">Get help</NavLink>
            <NavLink to="/approach">Our approach</NavLink>
          </nav>
        </header>

        <main className="app-main">
          <Suspense fallback={<p>Loading&hellip;</p>}>
            <Routes>
              <Route path="/" element={<CheckInPage />} />
              <Route path="/trends" element={<DashboardPage />} />
              <Route path="/help" element={<CrisisPage />} />
              <Route path="/approach" element={<ApproachPage />} />
              <Route path="/approach/research" element={<ResearchIndexPage />} />
              <Route path="/approach/research/:slug" element={<ResearchDocPage />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="app-footer">
          <p className="disclaimer" role="note">
            Soft Reset is a wellness companion, not a medical device. It does not diagnose or treat
            any condition. If something feels urgent, please use the help link above.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
