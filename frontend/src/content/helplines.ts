// Verified India crisis helplines. Re-verify every number on submission day —
// NGO lines drift (DESIGN §8, research/04). Reachable with no sign-up, no paywall.

export interface Helpline {
  name: string
  /** Human-readable number for display. */
  number: string
  /** Digits-only value for the tel: link. */
  tel: string
  detail: string
}

export const HELPLINES: Helpline[] = [
  {
    name: 'Tele-MANAS',
    number: '14416',
    tel: '14416',
    detail: 'Govt. of India mental-health support · 24×7 · many languages',
  },
  {
    name: 'KIRAN',
    number: '1800-599-0019',
    tel: '18005990019',
    detail: 'National mental-health helpline · 24×7 · toll-free',
  },
  {
    name: 'iCALL',
    number: '9152987821',
    tel: '9152987821',
    detail: 'Free psychosocial counselling (TISS) · Mon–Sat',
  },
  {
    name: 'Emergency',
    number: '112',
    tel: '112',
    detail: 'Immediate danger — all-India emergency number',
  },
]
