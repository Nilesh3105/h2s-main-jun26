import './ServerNotice.css'

import type { ReactNode } from 'react'

export interface ServerNoticeProps {
  children?: ReactNode
}

/**
 * A calm, non-alarming notice for when the backend isn't reachable (e.g. the
 * static hosted preview with no server running). Deliberately styled as gentle
 * info, not a red error — the app's deterministic tools and crisis help still
 * work without the server.
 */
export function ServerNotice({ children }: ServerNoticeProps) {
  return (
    <div className="server-notice" role="status">
      <p className="server-notice__title">Saved data is offline right now</p>
      <p>
        {children ??
          'We can’t reach the Soft Reset server, so anything that saves or loads data is paused. The breathing and grounding tools and the help link still work.'}
      </p>
    </div>
  )
}
