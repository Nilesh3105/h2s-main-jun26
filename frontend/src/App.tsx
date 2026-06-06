import './App.css'

import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import { HelpResources } from './components/HelpResources'
import { CheckInPage } from './pages/CheckInPage'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  const [showHelp, setShowHelp] = useState(false)

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
            <button
              type="button"
              className="help-toggle"
              aria-expanded={showHelp}
              aria-controls="help-panel"
              onClick={() => setShowHelp((open) => !open)}
            >
              Need to talk now?
            </button>
          </div>

          <nav className="app-nav" aria-label="Primary">
            <NavLink to="/" end>
              Check in
            </NavLink>
            <NavLink to="/trends">Trends</NavLink>
          </nav>

          {showHelp && (
            <div id="help-panel" className="help-panel">
              <HelpResources />
            </div>
          )}
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<CheckInPage />} />
            <Route path="/trends" element={<DashboardPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p className="disclaimer" role="note">
            Soft Reset is a wellness companion, not a medical device. It does not diagnose or treat
            any condition. If something feels urgent, please reach out using the help button above.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
