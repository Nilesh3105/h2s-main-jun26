// Shared API types, mirrored from the backend Pydantic schemas.

export type TriggerCategory = 'academic' | 'social' | 'physical' | 'emotional'

export interface Trigger {
  slug: string
  label: string
  category: TriggerCategory
}

export type Technique =
  | 'breathing'
  | 'thought_record'
  | 'behavioral_activation'
  | 'sleep_winddown'
  | 'grounding'

export interface Recommendation {
  technique: Technique
  title: string
  rationale: string
  why_it_helps: string
  source: string
  factors: string[]
}

export interface CheckInPayload {
  mood: number
  energy: number
  sleep_hours: number
  note?: string | null
  trigger_slugs: string[]
}

export interface CheckInRecord {
  id: number
  created_at: string
  mood: number
  energy: number
  sleep_hours: number
  note: string | null
  triggers: Trigger[]
}

export interface CheckInResult {
  check_in: CheckInRecord
  recommendation: Recommendation
  crisis: boolean
}
