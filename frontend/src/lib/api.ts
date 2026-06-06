// Typed API client. Base URL comes from VITE_API_BASE (empty = same origin; the
// Vite dev server proxies /api to the backend). All failures surface as ApiError
// so the UI can show a calm, friendly message rather than crashing.

import type {
  CheckInPayload,
  CheckInRecord,
  CheckInResult,
  ExamDate,
  ExamKind,
  Insights,
  Trigger,
} from './types'

const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/+$/, '')

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  } catch {
    throw new ApiError(0, 'Could not reach the server. Please check your connection and try again.')
  }
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Something went wrong (${response.status}). Please try again.`,
    )
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export const api = {
  listTriggers: () => request<Trigger[]>('/api/triggers'),
  createCheckIn: (payload: CheckInPayload) =>
    request<CheckInResult>('/api/checkins', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  listCheckIns: (limit = 30) => request<CheckInRecord[]>(`/api/checkins?limit=${limit}`),
  logIntervention: (checkInId: number, technique: string, completed: boolean) =>
    request<{ status: string }>(`/api/checkins/${checkInId}/intervention`, {
      method: 'POST',
      body: JSON.stringify({ technique, completed }),
    }),
  getInsights: () => request<Insights>('/api/insights'),
  listExamDates: () => request<ExamDate[]>('/api/exam-dates'),
  addExamDate: (label: string, date: string, kind: ExamKind) =>
    request<ExamDate>('/api/exam-dates', {
      method: 'POST',
      body: JSON.stringify({ label, date, kind }),
    }),
  deleteExamDate: (id: number) => request<void>(`/api/exam-dates/${id}`, { method: 'DELETE' }),
}
