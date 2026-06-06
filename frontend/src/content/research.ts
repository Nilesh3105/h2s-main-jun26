// The cited research base, surfaced as browsable in-app pages. The markdown
// lives in /public/research (a mirror of the repo-root research/ folder, kept
// in sync by `npm run sync:research`) and is fetched + rendered on demand.

export interface ResearchDoc {
  slug: string
  file: string
  title: string
  summary: string
}

export const RESEARCH_DOCS: ResearchDoc[] = [
  {
    slug: 'overview',
    file: 'README.md',
    title: 'Overview & synthesis',
    summary: 'How the evidence fits together, and the decision each finding drove.',
  },
  {
    slug: 'exam-stress-india',
    file: '01-exam-stress-india.md',
    title: 'The reality for exam aspirants',
    summary: 'How widespread exam-season distress is, who it hits, and what actually predicts it.',
  },
  {
    slug: 'interventions',
    file: '02-evidence-based-interventions.md',
    title: 'What actually helps',
    summary:
      'Support techniques ranked by evidence — why breathing, thought-records, and behavioral activation.',
  },
  {
    slug: 'app-landscape',
    file: '03-app-landscape.md',
    title: 'The app landscape',
    summary: 'What existing apps do, the table-stakes, and the open lane for exam aspirants.',
  },
  {
    slug: 'safety-ethics-privacy',
    file: '04-safety-ethics-privacy.md',
    title: 'Safety, ethics & privacy',
    summary: 'Crisis handling, verified India helplines, the DPDP Act, and "not a medical device".',
  },
  {
    slug: 'accessibility',
    file: '05-accessibility-ux-best-practices.md',
    title: 'Accessibility & UX',
    summary: 'WCAG 2.2 choices, accessible component patterns, and the a11y tooling we run in CI.',
  },
]

export const RESEARCH_GITHUB_BASE =
  'https://github.com/Nilesh3105/h2s-main-jun26/blob/main/research/'

export function findResearchDoc(slug: string): ResearchDoc | undefined {
  return RESEARCH_DOCS.find((doc) => doc.slug === slug)
}
