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

// --- Trends & insights (Milestone 3) ---

export interface TrendPoint {
  /** ISO date (YYYY-MM-DD). */
  date: string
  /** Average mood (1–5) for that day. */
  mood: number
  count: number
}

export interface TriggerCount {
  slug: string
  label: string
  count: number
}

export interface InsightCard {
  title: string
  detail: string
  /** Tone hint for styling: 'positive' | 'watch' | 'neutral'. */
  tone: 'positive' | 'watch' | 'neutral'
}

export type ExamKind = 'exam' | 'result'

export interface ExamDate {
  id: number
  label: string
  date: string
  kind: ExamKind
}

export interface SeasonStatus {
  active: boolean
  label: string | null
  message: string | null
}

export interface Insights {
  trend: TrendPoint[]
  summary: string
  top_triggers: TriggerCount[]
  cards: InsightCard[]
  season: SeasonStatus
  total_check_ins: number
}

// --- GenAI assist (Milestone 5) — each carries `source: 'ai' | 'template'` ---

export interface Reflection {
  week_start: string
  body: string
  source: string
}

export interface ReframeResult {
  reframe: string
  source: string
  crisis: boolean
}

export interface PromptResult {
  prompt: string
  source: string
}

export interface TagsResult {
  triggers: Trigger[]
  source: string
  crisis: boolean
}
