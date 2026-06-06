import './App.css'

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import { CheckInPage } from './pages/CheckInPage'
import { CrisisPage } from './pages/CrisisPage'
import { DashboardPage } from './pages/DashboardPage'

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
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<CheckInPage />} />
            <Route path="/trends" element={<DashboardPage />} />
            <Route path="/help" element={<CrisisPage />} />
          </Routes>
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
