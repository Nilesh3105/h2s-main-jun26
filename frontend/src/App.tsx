import './App.css'

import { useState } from 'react'

import { HelpResources } from './components/HelpResources'
import { CheckInPage } from './pages/CheckInPage'

function App() {
  const [showHelp, setShowHelp] = useState(false)

  return (
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
        {showHelp && (
          <div id="help-panel" className="help-panel">
            <HelpResources />
          </div>
        )}
      </header>

      <main className="app-main">
        <CheckInPage />
      </main>

      <footer className="app-footer">
        <p className="disclaimer" role="note">
          Soft Reset is a wellness companion, not a medical device. It does not diagnose or treat
          any condition. If something feels urgent, please reach out using the help button above.
        </p>
      </footer>
    </div>
  )
}

export default App
