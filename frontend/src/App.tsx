import './App.css'

/**
 * Application shell. Intentionally minimal for Milestone 1 — it exists to prove
 * the rubric scaffolding (an accessible, tested, type-checked React app) before
 * the check-in loop lands in Milestone 2.
 */
function App() {
  return (
    <main className="app-shell">
      <header>
        <h1>Soft Reset</h1>
        <p className="tagline">
          A private, judgment-free space to check in on how you&rsquo;re doing. Take a breath, start
          fresh.
        </p>
      </header>

      <p className="disclaimer" role="note">
        Soft Reset is a wellness companion, not a medical device. It does not diagnose or treat any
        condition. If you need to talk to someone now, help is always one tap away.
      </p>
    </main>
  )
}

export default App
