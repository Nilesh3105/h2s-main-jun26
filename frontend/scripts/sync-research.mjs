// Mirror the repo-root research/ markdown into public/research so the app can
// serve + render it. The committed copy is the source of truth for the build;
// this script just refreshes it locally (run on `predev`, or `npm run
// sync:research`). It is a no-op when the source folder isn't present (e.g. a
// build sandbox that only contains the frontend), so it never breaks a build.

import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = join(here, '..', '..', 'research')
const dest = join(here, '..', 'public', 'research')

if (!existsSync(source)) {
  console.log('[sync-research] research/ not found — using the committed copy.')
  process.exit(0)
}

mkdirSync(dest, { recursive: true })
const copied = readdirSync(source).filter((name) => name.endsWith('.md'))
for (const name of copied) {
  cpSync(join(source, name), join(dest, name))
}
console.log(`[sync-research] synced ${copied.length} file(s) to public/research`)
