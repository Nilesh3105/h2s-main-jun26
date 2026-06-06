import './DataControls.css'

import { useState } from 'react'

import { api, isServerUnavailable } from '../lib/api'
import { ServerNotice } from './ServerNotice'

type Status = 'idle' | 'offline' | 'error'

/**
 * "Your data, your control" — lets you take your whole record with you or wipe
 * it for good. Export downloads the raw JSON; Delete uses a calm two-step
 * confirm (no jarring browser dialog) so it can't happen by accident. Both fall
 * back to a gentle offline notice when the server can't be reached.
 */
export function DataControls() {
  const [exportStatus, setExportStatus] = useState<Status>('idle')
  const [exportError, setExportError] = useState('')

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState<Status>('idle')
  const [deleteError, setDeleteError] = useState('')

  async function handleExport() {
    setExportStatus('idle')
    setExportError('')
    try {
      const data = await api.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'soft-reset-data.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      if (isServerUnavailable(err)) {
        setExportStatus('offline')
      } else {
        setExportStatus('error')
        setExportError('We couldn’t prepare your export just now. Please try again.')
      }
    }
  }

  async function handleConfirmDelete() {
    setDeleteStatus('idle')
    setDeleteError('')
    try {
      await api.deleteData()
      setConfirmingDelete(false)
      setDeleted(true)
    } catch (err: unknown) {
      if (isServerUnavailable(err)) {
        setDeleteStatus('offline')
      } else {
        setDeleteStatus('error')
        setDeleteError('We couldn’t delete your data just now. Please try again.')
      }
    }
  }

  function cancelDelete() {
    setConfirmingDelete(false)
  }

  return (
    <div className="data-controls">
      <div className="data-controls__action">
        <button type="button" className="data-controls__export" onClick={handleExport}>
          Export my data
        </button>
        <p className="data-controls__hint">
          Download everything you&rsquo;ve saved as a JSON file you can keep.
        </p>
        {exportStatus === 'offline' && <ServerNotice />}
        {exportStatus === 'error' && (
          <p className="form-error" role="alert">
            {exportError}
          </p>
        )}
      </div>

      <div className="data-controls__action">
        {deleted ? (
          <p className="data-controls__done" role="status" aria-live="polite">
            Your data has been deleted.
          </p>
        ) : (
          <>
            <div className="data-controls__delete-row">
              <button
                type="button"
                className="data-controls__delete"
                onClick={confirmingDelete ? handleConfirmDelete : () => setConfirmingDelete(true)}
              >
                {confirmingDelete ? 'Tap again to confirm' : 'Delete all my data'}
              </button>
              {confirmingDelete && (
                <button type="button" className="data-controls__cancel" onClick={cancelDelete}>
                  Cancel
                </button>
              )}
            </div>
            <p className="data-controls__hint">
              This permanently removes your check-ins and saved dates. It can&rsquo;t be undone.
            </p>
            {deleteStatus === 'offline' && <ServerNotice />}
            {deleteStatus === 'error' && (
              <p className="form-error" role="alert">
                {deleteError}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
