// Short, deterministic step hints shown alongside a matched intervention.
// Content-as-data (DESIGN §10). The richer guided flows for thought-record and
// behavioral activation arrive in Milestone 4; these keep every technique useful
// in the meantime.

import type { Technique } from '../lib/types'

export const INTERVENTION_STEPS: Record<Technique, string[]> = {
  breathing: [
    'Breathe in slowly for 4 counts.',
    'Hold gently for 4.',
    'Breathe out for 4, then hold for 4. Repeat a few rounds.',
  ],
  thought_record: [
    'Name the situation in one line.',
    'Write down the thought that is bothering you.',
    'Now write a fairer, kinder way to see it.',
  ],
  behavioral_activation: [
    'Pick one tiny task — five minutes, no more.',
    'Do just that one thing.',
    'Tick it off. Momentum counts more than motivation.',
  ],
  sleep_winddown: [
    'Set a wind-down reminder 30 minutes before bed.',
    'Screens down, lights low, slow things down.',
    'Aim for the same sleep and wake time, even now.',
  ],
  grounding: [
    'Name five things you can see.',
    'Then four you can hear and three you can touch.',
    'Two you can smell, and one slow breath.',
  ],
}
